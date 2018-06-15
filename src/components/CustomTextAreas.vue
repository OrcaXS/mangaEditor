<template>
  <div>
    <div
      v-for="(textArea, idx) in textAreas"
      :key="idx"
      :style="getTextAreaStyle(textArea)"
      class="textArea"
      contentEditable
      >{{ getTextContent(textArea) }}</div>
  </div>
</template>

<script>
export default {
  name: 'CustomTextAreas',

  computed: {
    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },
  },

  methods: {
    getTextContent(textArea) {
      return textArea.textContent || '测试\n输入あのイーハトーヴォのすきとおった風、\nABCDEFGHIJKLMabcdefghijklm1234567890';
    },

    getTextAreaStyle(textArea) {
      return {
        left: `${textArea.x}px`,
        top: `${textArea.y}px`,
        width: `${textArea.width}px`,
        heigth: `${textArea.width}px`,
      };
    },
  },

};
</script>

<style scoped lang="postcss">
.textArea {
  z-index: 20;
  position: absolute;
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
}
</style>
