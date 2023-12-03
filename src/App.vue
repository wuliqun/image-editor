<template>
  <div id="app">
    <imageEditor :config="config" />
  </div>
</template>

<script>
import imageEditor from "./components/imageEditor.vue";
export default {
  name: "App",
  components: { imageEditor },
  data() {
    return {
      config: {
        backgroundImage:
          "https://img2.hayocdn.com/client/image/81/7f6088a2fe92ab26b123a47c000ba973.png~tplv-jiivuhwl6u-resize:5000.awebp",
      },
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  width: 70vw;
  margin: 100px auto 0;
}
</style>
