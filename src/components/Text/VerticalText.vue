<template>
  <v-group
    v-if="configReady && isVisible && !isEditing"
    ref="textGroupWrapper"
    @click="selectTextArea(textAreaIdx)"
  >
    <!-- <v-group
      ref="textGroup"
      :config="groupConfig"
      @transformEnd="onTransformEnd"
      @dragend="onTransformEnd"
      @click="showEditor(textAreaIdx)"
    > -->
    <v-rect
      ref="bgRect"
      :config="bgRectConfig"
      @transformEnd="onTransformEnd"
      @dragend="onTransformEnd"
    />
    <v-text
      v-for="(val, idx) in charConfig"
      :key="idx"
      :config="val"
    />

    <!-- <v-rect
      v-if="textAreaIdx === selectedTextAreaIdx"
      :config="rectStyle(textConfig)"
      @click="showEditor(textAreaIdx)"
    /> -->
  </v-group>
</template>
<script>
import Konva from 'konva';

export default {
  name: 'VerticalText',
  props: {
    textConfig: {
      type: Object,
      required: true,
      validator(val) {
        return val.x.toString() && val.y.toString() && val.width && val.height && val.lineSpacing && val.textSpacing;
      },
    },
    textAreaIdx: {
      type: String,
      required: true,
      validator(val) {
        return /\d/.test(val);
      },
    },
    balloonIdx: {
      type: Number,
      required: true,
      validator(val) {
        return /\d/.test(val);
      },
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      configReady: false,
      // textPlaceholder: '测试\n输入あのイーハトーヴォのすきとおった風、\nABCDEFGHIJKLMabcdefghijklm1234567890',
      charConfig: {},
    };
  },

  computed: {
    textAreaStyle() {
      return {
        zIndex: 20,
        position: 'absolute',
        top: `${this.textConfig.x}px`,
        left: `${this.textConfig.y}px`,
      };
    },

    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },

    currentTextArea() {
      return this.textAreas[this.textAreaIdx];
    },

    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    isEditing() {
      return this.$store.state.canvas.currentlySelected.textAreaEditor === this.textAreaIdx;
    },

    groupConfig() {
      return {
        x: this.textConfig.x,
        y: this.textConfig.y,
        width: this.textConfig.width,
        height: this.textConfig.height,
        scaleX: this.textConfig.scaleX,
        scaleY: this.textConfig.scaleY,
        draggable: true,
      };
    },

    // rectStyle() {
    //   return {
    //     x: 0,
    //     y: 0,
    //     width: this.textConfig.width,
    //     height: this.textConfig.height,
    //     scaleX: this.textConfig.scaleX,
    //     scaleY: this.textConfig.scaleY,
    //     stroke: 'purple',
    //     strokeWidth: 3,
    //   };
    // },

    bgRectConfig() {
      return {
        x: this.textConfig.x,
        y: this.textConfig.y,
        width: this.textConfig.width,
        height: this.textConfig.height,
        scaleX: this.textConfig.scaleX,
        scaleY: this.textConfig.scaleY,
        fill: this.textConfig.bgColor,
        draggable: true,
      };
    },
  },

  mounted() {
    this.generateCharConfig();
    this.$eventHub.$on('textContentUpdated', (idx) => {
      if (this.textAreaIdx === idx) {
        console.log('generateCharConfig');
        setTimeout(() => this.generateCharConfig(), 0);
        // this.$store.dispatch('clearSelection', { type: 'clearAll' });
      }
      if (idx === 'updateAll') {
        console.log('generateAllCharConfig');
        setTimeout(() => this.generateCharConfig(), 0);
      }
    });
  },

  beforeDestroy() {
    this.$eventHub.$off('textContentUpdated');
  },

  methods: {
    onTransformEnd(e) {
      const target = this.$refs.bgRect.getStage();
      const newRect = {
        x: target.x(),
        y: target.y(),
        width: target.width(),
        height: target.height(),
        scaleX: target.scaleX(),
        scaleY: target.scaleY(),
      };
      console.log(newRect);
      this.$store.dispatch('transformTextArea', {
        id: this.$route.params.file_id,
        idx: this.textAreaIdx,
        newRect,
      });
      this.$eventHub.$emit('textContentUpdated', this.textAreaIdx);
    },

    onDragEnd(e) {
      const textGroup = this.$refs.textGroup.getStage();
      const position = {
        x: textGroup.x(),
        y: textGroup.y(),
      };
      console.log(position);
      this.$store.dispatch('dragTextArea', {
        id: this.$route.params.file_id,
        idx: this.textAreaIdx,
        position,
      });
      this.$eventHub.$emit('textContentUpdated', this.textAreaIdx);
    },

    showEditor(textAreaIdx) {
      console.log('showEditor');
      if (this.balloonIdx > -1) {
        this.$store.dispatch('setElementVisibility', {
          id: this.$route.params.file_id, type: 'balloon', idx: this.balloonIdx, status: true,
        });
      }
      this.$store.dispatch('setSelection', { type: 'textAreaEditor', idx: textAreaIdx });
      this.$store.dispatch('clearSelection', { type: 'textAreas' });
      // this.$eventHub.$emit('textContentUpdated', this.selectedTextAreaIdx);
    },

    // selectTextArea(textAreaIdx) {
    //   this.$store.dispatch('setSelection', { type: 'textAreas', idx: textAreaIdx });
    // },

    selectTextArea(textAreaIdx) {
      console.log('textareaSelected');
      if (this.selectedTextAreaIdx !== textAreaIdx) {
        this.$store.dispatch('setSelection', { type: 'textAreas', idx: textAreaIdx });

        const stage = this.$parent.$parent.$parent.$parent.$parent.$refs.stage.getStage();
        stage.find('Transformer').destroy();
        const tr = new Konva.Transformer({
          resizeEnabled: true,
          rotateEnabled: false,
        });
        this.$refs.textGroupWrapper.getStage().add(tr);
        tr.attachTo(this.$refs.bgRect.getStage());
        this.$refs.textGroupWrapper.getStage().draw();
      } else {
        this.showEditor(textAreaIdx);
      }
    },

    // deleteTransformer() {
    // console.log('clickedOutside');
    // const stage = this.$parent.$parent.$parent.$parent.$parent.$refs.stage.getStage();
    // stage.find('Transformer').destroy();
    // },

    generateCharConfig() {
      function measureTextHeight(text, fontSize, fontFamily) {
      // create a temp canvas
        const width = fontSize * 2;
        const height = fontSize * 2;
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
        const ctx = cvs.getContext('2d');

        const fontSizeFace = `${fontSize}px ${fontFamily}`;

        ctx.font = fontSizeFace;
        ctx.clearRect(0, 0, width, height);
        ctx.fillText(text, 0, fontSize * 0.9); // 3 is a magic number for vertical shift
        let topMost = height;
        let leftMost = width;
        let rightMost = 0;
        let bottomMost = 0;

        for (let x = 0; x < height; x += 1) {
        // row-first order search, for checking heights
          for (let y = 0; y < width; y += 1) {
            const w = ctx.getImageData(y, x, 1, 1).data[3];
            if (w > 16) {
              if (x < topMost) {
                topMost = x;
              }
              if (x > bottomMost) {
                bottomMost = x;
              }
              if (y < leftMost) {
                leftMost = y;
              }
              if (y > rightMost) {
                rightMost = y;
              }
            }
          }
        }
        const result = {};
        result.width = rightMost - leftMost;
        result.height = bottomMost - topMost;
        result.left = leftMost;
        result.top = topMost;
        cvs.remove();
        return result;
      }

      function isSymbol(char) {
        const code = char.charCodeAt(0);
        if (code >= 0xFE00 && code <= 0xFFEF) {
          return true;
        }
        if (code >= 0x3000 && code <= 0x303F) {
          return true;
        }
        if (code >= 0x2600 && code <= 0x26FF) {
          return true;
        }
        if (code >= 0x2700 && code <= 0x27BF) {
          return true;
        }
        if (code >= 0xFE10 && code <= 0xFE1F) {
          return true;
        }
        return false;
      }

      function needRotation(char) {
        const code = char.charCodeAt(0);
        const LUT = [
          0x2e3a, 0x2014, 0x2026, 0xff5e, 0x002d, 0x2013, 0x2014, 0x002f, 0x300c, 0x300d, 0x300e, 0x300f, 0x201c, 0x201d, 0x2018, 0x2019, 0xff08, 0xff09, 0x300a, 0x300b, 0x3008, 0x3009, 0x3010, 0x3011, 0x3016, 0x3017, 0x3014, 0x3015, 0xff3b, 0xff3d, 0xff5b, 0xff5d, 0xff3f, 0xfe4f,
        ];
        const testResult = LUT.includes(code);
        return testResult;
      }


      let offsetX = (this.textConfig.width * this.textConfig.scaleX) - this.textConfig.fontSize;
      let offsetY = 0;
      this.charConfig = {};
      this.configReady = false;

      if (this.textConfig.text.length) {
        for (let i = 0; i < this.textConfig.text.length; i += 1) {
          const char = this.textConfig.text.charAt(i);
          if (char === '\n' && this.textConfig.offsetY !== 0) {
            offsetX -= this.textConfig.lineSpacing * this.textConfig.fontSize;
            offsetY = 0;
          }
          if (char !== '\n') {
            let topOffset = 0;
            let leftOffset = 0;
            let rotateFlag = false;

            if (isSymbol(char)) {
              const charOffset = measureTextHeight(char, this.textConfig.fontSize, this.textConfig.fontFamily);
              topOffset = (this.textConfig.fontSize / 2) - ((charOffset.top + charOffset.height) / 2);
              leftOffset = (this.textConfig.fontSize / 2) - ((charOffset.left + charOffset.width) / 2);
            }

            if (needRotation(char)) {
              rotateFlag = true;
            }

            if (rotateFlag) {
              [topOffset, leftOffset] = [leftOffset, topOffset];
            }

            const config = {
              x: this.textConfig.x + offsetX + leftOffset + (this.textConfig.fontSize / 2),
              y: this.textConfig.y + offsetY + topOffset + (this.textConfig.fontSize / 2),
              offsetX: this.textConfig.fontSize / 2,
              offsetY: this.textConfig.fontSize / 2,
              text: char,
              fontSize: this.textConfig.fontSize,
              fontFamily: this.textConfig.fontFamily,
              fontStyle: this.textConfig.fontStyle,
              fill: this.textConfig.fgColor,
            };

            this.charConfig[i] = config;
            offsetY += this.textConfig.textSpacing * this.textConfig.fontSize;
            if (offsetY >= (this.textConfig.height * this.textConfig.scaleY)) {
              offsetY = 0;
              offsetX -= this.textConfig.lineSpacing * this.textConfig.fontSize;
            }
          }
        }
      }
      this.configReady = true;
    },
  },
};
</script>
