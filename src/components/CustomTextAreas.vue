<template>
  <div>
    <div
      :style="getTextAreaStyle(selectedTextArea)"
      class="textArea"
      contentEditable
    >{{ getTextContent(selectedTextArea) }}</div>
  </div>
</template>

<script>
export default {
  name: 'CustomTextAreas',

  computed: {
    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },

    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentTextArea;
    },

    selectedTextArea() {
      return this.textAreas[this.selectedTextAreaIdx];
    },

    showTextArea() {
      return /\d/.test(this.selectedTextAreaIdx);
    },

    currentScale() {
      return this.$store.state.canvas.zoomLevel;
    },

    currentScrollingPosition() {
      return this.$store.state.canvas.currentScrollingPosition;
    },
  },

  methods: {
    getTextContent(textArea) {
      return textArea.textContent || '测试\n输入あのイーハトーヴォのすきとおった風、\nABCDEFGHIJKLMabcdefghijklm1234567890';
    },

    getTextAreaStyle(textArea) {
      return {
        left: `calc(${(textArea.x + 50) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(textArea.y + 50) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${textArea.width * (this.currentScale / 100)}px`,
        height: `${textArea.height * (this.currentScale / 100)}px`,
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
  background-color: white;
}
</style>
