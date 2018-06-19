<template>
  <v-group
    v-if="configReady"
    ref="textGroup"
  >
    <v-text
      v-for="(val, idx) in charConfig"
      :key="idx"
      :config="val"
    />
    <v-rect
      :config="rectStyle(textConfig)"
      @dblclick="showEditor(areaIndex)"
    />
  </v-group>
</template>
<script>
export default {
  name: 'VerticalText',
  props: {
    textConfig: {
      type: Object,
      required: true,
      validator(val) {
        return val.text && val.x && val.y && val.width && val.height && val.lineSpacing && val.textSpacing;
      },
    },
    areaIndex: {
      type: String,
      required: true,
      validator(val) {
        return /\d/.test(val);
      },
    },
  },

  data() {
    return {
      configReady: false,
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

  },

  mounted() {
    this.generateCharConfig();
    // this.rotateText(text, textArea.width, 30, textArea.x, textArea.y);
    const self = this;
    // eslint-disable-next-line no-underscore-dangle
    self.$root.$on('textConfigUpdated', () => {
      setTimeout(() => self.generateCharConfig(), 0);
      // self.generateCharConfig();
      // self.$root.$emit('charConfigUpdated');
    });
  },

  methods: {
    rectStyle(textConfig) {
      return {
        x: textConfig.x,
        y: textConfig.y,
        width: textConfig.width,
        height: textConfig.height,
        stroke: 'purple',
        strokeWidth: 5,
      };
    },

    showEditor(areaIndex) {
      this.$store.dispatch('setTextAreaIdx', { idx: areaIndex });
    },

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
        const LUT = [0x2e3a, 0x2014, 0x2026, 0xff5e, 0x002d, 0x2013, 0x2014, 0x002f, 0x300c, 0x300d, 0x300e, 0x300f, 0x201c, 0x201d, 0x2018, 0x2019, 0xff08, 0xff09, 0x300a, 0x300b, 0x3008, 0x3009, 0x3010, 0x3011, 0x3016, 0x3017, 0x3014, 0x3015, 0xff3b, 0xff3d, 0xff5b, 0xff5d, 0xff3f, 0xfe4f];
        const testResult = LUT.includes(code);
        return testResult;
      }


      let offsetX = this.textConfig.width - this.textConfig.fontSize;
      let offsetY = 0;
      this.charConfig = {};
      this.configReady = false;

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
            fill: 'green',
            // draggale: true,
          };

          this.charConfig[i] = config;
          offsetY += this.textConfig.textSpacing * this.textConfig.fontSize;
          if (offsetY >= this.textConfig.height) {
            offsetY = 0;
            offsetX -= this.textConfig.lineSpacing * this.textConfig.fontSize;
          }
        }
      }

      this.configReady = true;
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
