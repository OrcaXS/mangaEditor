<template>
  <div
    ref="textArea"
    :style="textAreaStyle"
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

    textAreaStyle() {
      const fontStyles = ['normal', 'oblique', 'italic'];
      const styleObj = {
        fontSize: `${this.selectedTextArea.fontSize * (this.currentScale / 100)}px`,
        fontStyle: 'normal',
        fontFamily: `"${this.selectedTextArea.fontFamily}", sans-serif`,
        fontWeight: '400',
        left: `calc(${(this.selectedTextArea.x + 0) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(this.selectedTextArea.y + 0) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${this.selectedTextArea.width * (this.currentScale / 100)}px`,
        height: `${this.selectedTextArea.height * (this.currentScale / 100)}px`,
        color: this.selectedTextArea.colors.hex || 'black',
      };
      if (fontStyles.indexOf(this.selectedTextArea.fontStyle) > -1) {
        styleObj.fontStyle = this.selectedTextArea.fontStyle;
      } else {
        styleObj.fontWeight = this.selectedTextArea.fontStyle;
      }
      return styleObj;
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
