<template>
  <div class="ai-editor-wrapper">
    <div class="ai-editor-toolbar">
      <button>undo</button>
      <button>restore</button>
      <button @click="changeOperation(LAYER_TYPE.CROP)">crop</button>
      <button @click="changeOperation(LAYER_TYPE.RECTANGLE)">rect</button>
      <button @click="changeOperation(LAYER_TYPE.TEXT)">text</button>
    </div>
    <div
      class="ai-editor"
      @mousedown="handleEditorMousedown"
      @mousemove="handleEditorMousemove"
    >
      <div class="ai-editor-content" ref="editor">
        <canvas class="ai-editor-bg" ref="bgCanvas"></canvas>
        <component
          v-for="(layer, index) in layers"
          :key="layer.config.zIndex"
          :is="layer.type"
          :config="layer.config"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { LAYER_TYPE, getOverlapArea } from "./utils";
import editorCropper from "./editorCropper.vue";
export default {
  props: {
    config: Object,
  },
  data() {
    return {
      backgroundImage: "",
      layers: [],
      histories: [],
      historyIndex: -1,
      canvasRect: null,
      maxZIndex: 0,
      activeOperation: LAYER_TYPE.CROP,
      LAYER_TYPE,
      isCropInit: false,
      cropConfig: null,
      point: null,
    };
  },
  mounted() {
    this.render();
    document.addEventListener("mouseup", this.handleMouseup);
  },
  beforeDestroy() {
    document.removeEventListener("mouseup", this.handleMouseup);
  },
  computed: {
    canUndo() {
      return this.histories.length > 0 && this.historyIndex > 0;
    },
    canRestore() {
      return (
        this.histories.length > 0 &&
        this.historyIndex < this.histories.length - 1
      );
    },
    hasCropLayer() {
      return (
        this.layers.length > 0 && this.layers.at(-1).type === LAYER_TYPE.CROP
      );
    },
  },
  methods: {
    render() {
      const rect = this.$refs.editor.getBoundingClientRect();
      this.canvasRect = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
      };
      this.backgroundImage = this.config.backgroundImage;
      this.layers = this.config.layers || [];
      let maxZIndex = 0;
      this.layers.forEach((layer) => {
        if (layer.zIndex > maxZIndex) {
          maxZIndex = layer.zIndex;
        }
      });
      this.maxZIndex = maxZIndex;

      this.renderBackground();
    },
    renderBackground() {
      const canvas = this.$refs.bgCanvas;
      const { width, height } = canvas;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = this.backgroundImage;
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        img.onload = null;
      };
    },
    changeOperation(op) {
      if (op !== this.activeOperation) {
        if (this.activeOperation === LAYER_TYPE.CROP) {
          this.layers = this.layers.filter(
            (layer) => layer.type !== LAYER_TYPE.CROP
          );
        }
        this.activeOperation = op;
      }
    },
    handleEditorMousedown(e) {
      if (this.activeOperation !== LAYER_TYPE.CROP || this.hasCropLayer) {
        return;
      }
      this.point = {
        x: e.clientX,
        y: e.clientY,
      };
      this.isCropInit = true;
    },
    handleEditorMousemove(e) {
      if (!this.isCropInit) {
        return;
      }
      const area = getOverlapArea(
        this.point,
        { x: e.clientX, y: e.clientY },
        this.canvasRect,
        16 / 9
      );
      if (!area) {
        if (this.hasCropLayer) {
          this.layers.pop();
        }
        return;
      }

      let zIndex;
      if (this.hasCropLayer) {
        zIndex = this.layers.pop().config.zIndex;
      } else {
        zIndex = ++this.maxZIndex;
      }
      this.layers.push({
        type: LAYER_TYPE.CROP,
        config: {
          zIndex,
          isIntial: true,
          x: area.left - this.canvasRect.left,
          y: area.top - this.canvasRect.top,
          w: area.width,
          h: area.height,
        },
      });
    },
    handleMouseup() {
      if (this.isCropInit) {
        this.isCropInit = false;
        const index = this.layers.length - 1;
        const layer = this.layers[index];
        layer.config.isIntial = false;
        this.layers.splice(index, 1, layer);
      }
    },
    crop() {},
    addLayer() {
      const layer = {
        type: this.activeOperation,
        zIndex: ++this.maxZIndex,
      };
      this.layers.push(layer);
    },
    undo() {
      if (this.canUndo) {
        this.historyIndex--;
      }
    },
    restore() {
      if (this.canRestore) {
        this.historyIndex++;
      }
    },
  },
  components: {
    [LAYER_TYPE.CROP]: editorCropper,
  },
};
</script>
<style lang="scss" scoped>
.ai-editor-toolbar {
}
.ai-editor {
  padding: 50px;
  background-color: #ccc;
  &-content {
    overflow: hidden;
    position: relative;
    height: 0;
    padding-top: 56.25%;
  }
  &-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
