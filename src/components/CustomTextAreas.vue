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

    selectedTextAreaEditorIdx() {
      return this.$store.state.canvas.currentlySelected.textAreaEditor;
    },

    selectedTextArea() {
      return this.textAreas[this.selectedTextAreaEditorIdx];
    },

    showTextAreaEditor() {
      return /\d/.test(this.selectedTextAreaEditorIdx);
    },

    currentScale() {
      return this.$store.state.canvas.zoomLevel;
    },

    currentScrollingPosition() {
      return this.$store.state.canvas.currentScrollingPosition;
    },

    textAreaStyle() {
      const textArea = this.selectedTextArea;
      const fontStyles = ['normal', 'oblique', 'italic'];
      const styleObj = {
        fontSize: `${textArea.fontSize * (this.currentScale / 100)}px`,
        fontStyle: 'normal',
        fontFamily: `"${textArea.fontFamily}", sans-serif`,
        fontWeight: '400',
        left: `calc(${(textArea.x + 0) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(textArea.y + 0) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${textArea.width * (this.currentScale / 100)}px`,
        height: `${textArea.height * (this.currentScale / 100)}px`,
        color: textArea.colors.hex || 'black',
      };
      if (fontStyles.indexOf(textArea.fontStyle) > -1) {
        styleObj.fontStyle = textArea.fontStyle;
      } else {
        styleObj.fontWeight = textArea.fontStyle;
      }
      return styleObj;
    },
  },

  watch: {
    selectedTextAreaEditorIdx(newIdx, oldIdx) {
      console.log(newIdx);
      this.getTextContent();
      this.$refs.textArea.focus();
    },
  },

  mounted() {
    this.getTextContent();
    // this.$refs.textArea.focus();
    setTimeout(() => this.$refs.textArea.focus(), 0);
    this.$eventHub.$on('clickedCanvas', () => {
      if (this.selectedTextAreaEditorIdx) {
        console.log('handled by CustomTextAreas');
        this.$refs.textArea.blur();
        this.emitTextChange();
      }
    });
  },

  methods: {
    getTextContent() {
      this.currentTextContent = this.selectedTextArea.textContent || '';
    },

    emitTextChange() {
      this.$store.dispatch('setTextAreaContent', { id: this.$route.params.file_id, idx: this.selectedTextAreaEditorIdx, content: this.currentTextContent });
      this.$eventHub.$emit('textContentUpdated', this.selectedTextAreaEditorIdx);
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
    },

    onTextAreaBlur(e) {
      this.currentTextContent = e.target.textContent;
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
