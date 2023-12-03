<template>
  <div class="ai-editor-layer" :style="style"></div>
</template>
<script>
export default {
  props: {
    config: Object,
  },
  data() {
    return {};
  },
  computed: {
    style() {
      return {
        zIndex: this.config.zIndex,
        top: this.config.x + "px",
        left: this.config.y + "px",
        width: this.config.w + "px",
        height: this.config.h + "px",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.ai-editor-layer {
  position: absolute;
}
</style>
