<template>
  <div
    ref="textArea"
    :style="getTextAreaStyle(selectedTextArea)"
    class="textArea"
    contentEditable
    @blur="onTextAreaBlur"
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
    setTimeout(() => this.$refs.textArea.focus(), 0);
    this.$root.$on('clickedCanvas', () => {
      if (this.$refs.textArea) {
        this.$refs.textArea.blur();
        this.emitTextChange();
      }
    });
  },

  methods: {
    setTextContent() {
    },

    getTextContent() {
      this.currentTextContent = this.selectedTextArea.textContent || '';
    },

    getTextAreaStyle(textArea) {
      return {
        fontSize: `${this.selectedTextArea.fontSize * (this.currentScale / 100)}px`,
        fontStyle: this.selectedTextArea.fontStyle,
        fontFamily: `"${this.selectedTextArea.fontFamily}", sans-serif`,
        fontWeight: `${this.selectedTextArea.fontWeight}`,
        left: `calc(${(textArea.x + 50) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(textArea.y + 50) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${textArea.width * (this.currentScale / 100)}px`,
        height: `${textArea.height * (this.currentScale / 100)}px`,
        color: textArea.colors.hex || 'black',
      };
    },

    emitTextChange() {
      this.$store.dispatch('setTextAreaContent', { id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, content: this.currentTextContent });
      this.$eventHub.$emit('textContentUpdated', this.selectedTextAreaIdx);
      this.$store.dispatch('setTextAreaIdx', { idx: null });
    },

    onTextAreaBlur(e) {
      this.currentTextContent = e.target.textContent;
    },

    onClickOutside(e) {
      // if (this.selectedTextAreaIdx) {
      //   this.$refs.textArea.blur();
      // }
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
