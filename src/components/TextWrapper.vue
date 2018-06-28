<template>
  <v-group>
    <VerticalText
      v-for="(val, idx) in verticalTextConfigs"
      :key="idx"
      :text-config="val"
      :area-index="idx"
      :is-visible="val.visible"
    />
  </v-group>
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
      // text: '',
      fontSize: 30,
      lineSpacing: 1.10,
      textSpacing: 1.00,
      fontFamily: 'Arial',
      config: {},
    };
  },

  computed: {
    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },

    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    verticalTextConfigs() {
      const config = {};
      Object.entries(this.textAreas).forEach(([idx, val]) => {
        const offsetX = val.width - this.fontSize;
        const offsetY = 0;
        const textContent = val.textContent || '';
        config[idx] = {
          offsetX,
          offsetY,
          width: val.width,
          height: val.height,
          x: val.x + 0,
          y: val.y + 0,
          text: textContent,
          lineSpacing: this.lineSpacing,
          textSpacing: this.textSpacing,
          fontFamily: val.fontFamily || this.fontFamily,
          fontSize: val.fontSize || this.fontSize,
          fontStyle: val.fontStyle || 'normal',
          color: val.colors.hex || 'black',
          visible: val.visible,
          scaleX: val.scaleX || '1',
          scaleY: val.scaleY || '1',
        };
      });
      return config;
    },
  },

  watch: {
    selectedTextAreaIdx(newIdx, oldIdx) {
      if (newIdx) {
        this.$store.dispatch('clearSelection', { type: 'balloons' });
        this.$store.dispatch('clearSelection', { type: 'textAreaEditor' });
      }
      if (oldIdx) {
        this.$eventHub.$emit('textContentUpdated', oldIdx);
      }
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
