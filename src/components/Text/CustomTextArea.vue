<template>
  <v-group ref="group">
    <v-rect
      ref="rect"
      :config="{
        x: 60,
        y: 60,
        width: 100,
        height: 100,
        fill: 'white',
        name: 'rect',
        stroke: 'blue',
        strokeWidth: 5,
        draggable: true
      }"
    />
  </v-group>
</template>
<script>
import Konva from 'konva';

export default {
  name: 'CustomTextAreas',
  mounted() {
  },

  methods: {
    createTransformer() {
      const stage = this.$parent.$parent.$parent.$refs.stage.getStage();
      const tr = new Konva.Transformer();
      this.$refs.group.getStage().add(tr);
      tr.attachTo(this.$refs.rect.getStage());
      this.$refs.group.getStage().draw();
    },

    deleteTransformer() {
      const stage = this.$parent.$parent.$parent.$refs.stage.getStage();
      stage.find('Transformer').destroy();
    },
  },
};
</script>
