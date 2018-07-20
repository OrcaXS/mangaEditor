<template>
  <div
    v-if="showTextAreaEditor"
    ref="textArea"
    :style="textAreaStyle"
    class="textArea"
    contentEditable
    @blur="onTextAreaBlur"
  >{{ currentTextContent }}</div>
</template>

<script>
export default {
  name: 'TextEditor',
  data() {
    return {
      currentTextContent: '',
    };
  },

  computed: {
    selected() {
      return this.$store.state.editor.selected;
    },

    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },

    selectedTextAreaEditorIdx() {
      return this.selected.textAreaEditor;
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

    getColors() {
      return this.$store.getters.getRgbaColors({
        id: this.$route.params.file_id, idx: this.selected.textAreaEditor,
      });
    },

    textAreaStyle() {
      const textArea = this.selectedTextArea;
      const fontStyles = ['normal', 'oblique', 'italic'];
      const fontSize = textArea.fontSize || '24';

      const styleObj = {
        fontSize: `${fontSize * (this.currentScale / 100)}px`,
        fontStyle: 'normal',
        fontFamily: `"${textArea.fontFamily}", sans-serif`,
        fontWeight: '400',
        left: `calc(${(textArea.x + 0) * (this.currentScale / 100)}px + 15rem - ${this.currentScrollingPosition.dx}px)`,
        top: `calc(${(textArea.y + 0) * (this.currentScale / 100)}px + 3rem - ${this.currentScrollingPosition.dy}px)`,
        width: `${textArea.width * (this.currentScale / 100) * textArea.scaleX}px`,
        height: `${textArea.height * (this.currentScale / 100) * textArea.scaleY}px`,
        color: this.getColors.fgColor,
        background: this.getColors.bgColor,
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
      console.log({ newIdx, oldIdx });
      if (newIdx) {
        this.$store.dispatch('clearSelection', { type: 'textArea' });
        this.getTextContent();
        setTimeout(() => this.$refs.textArea.focus(), 0);
        // this.$refs.textArea.focus();
      }
      if (oldIdx) {
        this.$refs.textArea.blur();
        this.emitTextChange(oldIdx);
      }
    },
  },

  mounted() {
    this.getTextContent();
    // this.$refs.textArea.focus();
    // setTimeout(() => this.$refs.textArea.focus(), 0);
    // this.$eventHub.$on('clickedCanvas', () => {
    //   if (this.selectedTextAreaEditorIdx) {
    //     console.log(this.selectedTextAreaEditorIdx);
    //     console.log('handled by CustomTextAreas');
    //     this.$refs.textArea.blur();
    //     this.emitTextChange();
    //   }
    // });
  },

  beforeDestroy() {
    this.$eventHub.$off('clickedCanvas');
  },

  methods: {
    getTextContent() {
      this.currentTextContent = this.selectedTextArea ? this.selectedTextArea.textContent : '';
    },

    emitTextChange(oldIdx) {
      this.$store.dispatch('setTextAreaContent', { id: this.$route.params.file_id, idx: oldIdx, content: this.currentTextContent });
      this.$eventHub.$emit('textContentUpdated', oldIdx);
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
