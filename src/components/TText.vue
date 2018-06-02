<template>
  <div>
    <VerticalText
      v-for="(val, idx) in config"
      :key="idx"
      :text-config="val"
    />
  </div>
</template>
<script>
import VerticalText from './VerticalText';

export default {
  name: 'TText',
  components: {
    VerticalText,
  },
  props: {
    stageBoundingRect: {
      type: DOMRect,
      required: true,
    },
  },
  data() {
    return {
      text: '测试输入，a比B大\n老干爹是世界冠军！\n这段举几个例子来说，冯提莫在网易云电台上有一首《凉凉》和一首《婴儿》，《婴儿》这首歌就完全暴露了提莫音色尖锐的问题',
      fontSize: 30,
      lineSpacing: 1.10,
      textSpacing: 1.00,
      fontFamily: 'Helvetica',
      config: {},
    };
  },

  computed: {
    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },

  },

  mounted() {
    // this.rotateText(text, textArea.width, 30, textArea.x, textArea.y);
  },

  methods: {
    createVerticalTextConfig() {
      this.config = {};
      Object.entries(this.textAreas).forEach(([idx, val]) => {
        const offsetX = val.width - this.fontSize;
        const offsetY = 0;
        const textContent = val.textContent ? val.textContent : this.text;
        this.config[idx] = {
          offsetX,
          offsetY,
          width: val.width,
          height: val.height,
          x: val.x,
          y: val.y,
          text: textContent,
          lineSpacing: this.lineSpacing,
          textSpacing: this.textSpacing,
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
        };
      });
    },

    textAreaWidth() {
      return {
        width: this.$refs.textElement ? `${this.$refs.textElement.getStage().getAttr('width')}px` : '300px',
      };
    },
  },

  render(createElement) {
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

    const vGroupArr = [];
    Object.entries(this.textAreas).forEach(([idx, val]) => {
      const textArr = [];
      let offsetX = val.width - this.fontSize;
      let offsetY = 0;
      const textContent = val.textContent ? val.textContent : this.text;
      for (let i = 0; i < textContent.length; i += 1) {
        const char = textContent.charAt(i);
        if (char === '\n' && offsetY !== 0) {
          offsetY = 0;
          offsetX -= this.lineSpacing * this.fontSize;
        }
        if (char !== '\n') {
          let topOffset = 0;
          let leftOffset = 0;
          let rotateFlag = false;

          if (isSymbol(char)) {
            const charOffset = measureTextHeight(char, this.fontSize, this.fontFamily);
            topOffset = (this.fontSize / 2) - ((charOffset.top + charOffset.height) / 2);
            leftOffset = (this.fontSize / 2) - ((charOffset.left + charOffset.width) / 2);
          }

          if (needRotation(char)) {
            rotateFlag = true;
          }

          if (rotateFlag) {
            [topOffset, leftOffset] = [leftOffset, topOffset];
          }

          textArr.push(createElement('div', {
            props: {
              config: {
                x: val.x + offsetX + leftOffset + (this.fontSize / 2),
                y: val.y + offsetY + topOffset + (this.fontSize / 2),
                offsetX: this.fontSize / 2,
                offsetY: this.fontSize / 2,
                text: char,
                fontSize: this.fontSize,
                fontFamily: this.fontFamily,
                fill: 'green',
              },
            },
          }));
        }
      }
      console.log(textArr);
      vGroupArr.push(textArr);
    });

    console.log(VueKonva);

    const textGroupVNode = createElement('div', vGroupArr);
    console.log(textGroupVNode);

    return createElement('div', textGroupVNode);
  },

};
</script>

<style scoped lang="postcss">
</style>
