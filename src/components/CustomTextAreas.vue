<template>
  <div
    v-click-outside="onClickOutside"
    ref="textArea"
    :style="getTextAreaStyle(selectedTextArea)"
    class="textArea"
    contentEditable
    @blur="emitTextChange"
  >{{ currentTextContent }}</div>
</template>

<script>
export default {
  name: 'CustomTextAreas',
  data() {
    return {
      currentTextContent: '',
    };
  },

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

  watch: {
    selectedTextAreaIdx(newIdx, oldIdx) {
      console.log(newIdx);
      this.getTextContent();
      this.$refs.textArea.focus();
    },
  },

  mounted() {
    this.getTextContent();
    // this.$refs.textArea.focus();
  },

  methods: {
    setTextContent() {
    },

    getTextContent() {
      this.currentTextContent = this.selectedTextArea.textContent || '测试\n输入あのイーハトーヴォのすきとおった風、\nABCDEFGHIJKLMabcdefghijklm1234567890';
    },

    getTextAreaStyle(textArea) {
      return {
        fontSize: `${this.selectedTextArea.fontSize}px`,
        fontStyle: `${this.selectedTextArea.fontStyle}`,
        fontFamily: `${this.selectedTextArea.fontFamily}, sans-serif`,
        fontWeight: `${this.selectedTextArea.fontWeight}`,
        left: `calc(${(textArea.x + 50) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(textArea.y + 50) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${textArea.width * (this.currentScale / 100)}px`,
        height: `${textArea.height * (this.currentScale / 100)}px`,
      };
    },

    emitTextChange(e) {
      this.$store.dispatch('setTextAreaContent', { id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, content: e.target.textContent });
      this.$root.$emit('textContentUpdated');
      this.$store.dispatch('setTextAreaIdx', { idx: null });
    },

    onClickOutside(e) {
      if (this.selectedTextAreaIdx) {
        this.$refs.textArea.blur();
      }
      // this.$store.dispatch('setTextAreaIdx', { idx: null });
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
