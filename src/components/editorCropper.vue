<template>
  <div class="ai-editor-mask" :style="{ zIndex: config.zIndex }">
    <div class="ai-editor-cropper" :style="cropperStyle">
      <template v-if="shouldShowSlice && shouldShowResizer">
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
        <div class="slice"></div>
      </template>
      <template v-if="shouldShowResizer">
        <div class="resizer tl"></div>
        <div class="resizer tr"></div>
        <div class="resizer bl"></div>
        <div class="resizer br"></div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // {zIndex,isIntial,x,y,w,h}
    config: Object,
  },
  data() {
    return {};
  },
  computed: {
    cropperStyle() {
      return {
        top: this.config.y + "px",
        left: this.config.x + "px",
        width: this.config.w + "px",
        height: this.config.h + "px",
      };
    },
    shouldShowSlice() {
      return this.config.w >= 80;
    },
    shouldShowResizer() {
      return !this.config.isIntial;
    },
  },
};
</script>
<style lang="scss" scoped>
.ai-editor-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.ai-editor-cropper {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  outline: 1px solid #fff;
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: all-scroll;
  .slice {
    flex-grow: 1;
    width: 30%;
    border: solid #fff;
    border-width: 0 1px 1px 0;
    &:nth-child(3n) {
      border-right-width: 0;
    }
    &:nth-child(n + 7) {
      border-bottom-width: 0;
    }
  }
  .resizer {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: blue;
    &.tl {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      cursor: nwse-resize;
    }
    &.tr {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      cursor: nesw-resize;
    }
    &.bl {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
      cursor: nesw-resize;
    }
    &.br {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
      cursor: nwse-resize;
    }
  }
}
</style>
