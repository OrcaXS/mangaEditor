<template>
  <div>
    <v-text
      ref="textElement"
      :config="textConfig"
      @dblclick="editText"
    />
    <!-- <textarea -->
    <!--   v&#45;if="showTextArea" -->
    <!--   ref="textArea" -->
    <!--   :style="[textAreaStyle, textAreaWidth]" -->
    <!--   class="textArea" -->
    <!-- /> -->
  </div>
</template>
<script>
export default {
  name: 'TText',
  props: {
    stageBoundingRect: {
      type: DOMRect,
      required: true,
    },
  },
  data() {
    return {
      text: 'Some text here',
      showTextArea: false,
    };
  },

  computed: {
    textConfig() {
      return {
        x: 300,
        y: 15,
        text: this.text,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green',
        draggable: true,
      };
    },

    textAreaStyle() {
      return {
        zIndex: 20,
        position: 'absolute',
        top: `${this.textConfig.x}px`,
        left: `${this.textConfig.y}px`,
      };
    },

  },

  methods: {
    editText(e) {
      // this.showTextArea = true;
      const textPosition = this.$refs.textElement.getStage().getAbsolutePosition();
      const stageBox = this.stageBoundingRect;

      const textAreaDetail = {
        x: textPosition.x + stageBox.left,
        y: textPosition.y + stageBox.top,
        width: this.$refs.textElement.getStage().width(),
        textContent: this.$refs.textElement.getStage().text(),
      };

      this.$store.dispatch('addTextArea', { textAreaDetail });

      // create textarea and style it
      // const textarea = document.createElement('textarea');
      // document.body.appendChild(textarea);
      //
      // textarea.value = this.$refs.textElement.getStage().text();
      // textarea.style.position = 'absolute';
      // textarea.style.top = `${areaPosition.y}px`;
      // textarea.style.left = `${areaPosition.x}px`;
      // textarea.style.width = this.$refs.textElement.getStage().width();
      //
      // textarea.focus();


      // textarea.addEventListener('keydown', (e) => {
      //   // hide on enter
      //   if (e.keyCode === 13) {
      //     textNode.text(textarea.value);
      //     layer.draw();
      //     document.body.removeChild(textarea);
      //   }
      // });
    },

    textAreaWidth() {
      return {
        width: this.$refs.textElement ? `${this.$refs.textElement.getStage().getAttr('width')}px` : '300px',
      };
    },
  },

};
</script>

<style scoped lang="postcss">
</style>
