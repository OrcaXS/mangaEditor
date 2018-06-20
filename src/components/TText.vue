<template>
  <div>
    <VerticalText
      v-for="(val, idx) in verticalTextConfigs"
      :key="idx"
      :text-config="val"
      :area-index="idx"
    />
  </div>
</template>
<script>
import VerticalText from './VerticalText';

export default {
  name: 'TextWrapper',
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
      text: '',
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

    verticalTextConfigs() {
      const config = {};
      Object.entries(this.textAreas).forEach(([idx, val]) => {
        const offsetX = val.width - this.fontSize;
        const offsetY = 0;
        const textContent = val.textContent ? val.textContent : this.text;
        config[idx] = {
          offsetX,
          offsetY,
          width: val.width,
          height: val.height,
          x: val.x + 50,
          y: val.y + 50,
          text: textContent,
          lineSpacing: this.lineSpacing,
          textSpacing: this.textSpacing,
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
        };
      });
      return config;
    },
  },

  methods: {
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
