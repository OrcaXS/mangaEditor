<template>
  <textarea
    :style="textAreaStyle"
    :value="getTextAreas.textContent"
    class="textArea"
  />
</template>

<script>
export default {
  name: 'CustomTextAreas',

  computed: {
    getTextAreas() {
      return this.$store.state.canvas.textAreas[0];
    },
    textAreaStyle() {
      return {
        left: `${this.getTextAreas.x}px`,
        top: `${this.getTextAreas.y}px`,
        width: `${this.getTextAreas.width}px`,
      };
    },
  },
};
</script>

<style scoped lang="postcss">
.textArea {
  z-index: 20;
  position: absolute;
}
</style>
