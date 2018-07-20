<template>
  <div>
    <v-group
      v-for="(balloon, idx) in balloons"
      :key="idx"
    >
      <v-image
        v-if="balloon.visible"
        :config="balloonConfig[idx]"
      />
      <v-rect
        v-if="idx === currentBalloon"
        :config="balloonBoundingConfig[idx]"
      />
    </v-group>
  </div>
</template>

<script>
export default {
  name: 'Balloons',

  props: {
    balloonBlobs: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    currentBalloon() {
      return this.$store.state.editor.selected.balloon;
    },

    balloons() {
      return this.$store.state.canvas.file[this.$route.params.file_id].balloons;
    },

    selectedTextAreaEditorIdx() {
      return this.$store.state.editor.selected.textAreaEditor;
    },

    balloonConfig() {
      const config = {};
      Object.entries(this.balloons).forEach(([idx, balloon]) => {
        const balloonImage = new Image();
        balloonImage.src = URL.createObjectURL(this.balloonBlobs[idx]);
        config[idx] = {
          width: balloon.width,
          height: balloon.height,
          image: balloonImage,
          x: balloon.x + 0,
          y: balloon.y + 0,
        };
      });
      return config;
    },

    balloonBoundingConfig() {
      const config = {};
      Object.entries(this.balloons).forEach(([idx, balloon]) => {
        config[idx] = {
          width: balloon.width,
          height: balloon.height,
          x: balloon.x + 0,
          y: balloon.y + 0,
          stroke: 'skyblue',
          strokeWidth: 5,
        };
      });
      return config;
    },
  },

  watch: {
    currentBalloon(newIdx, oldIdx) {
      console.log({ oldIdx, newIdx });
      if (newIdx) {
        this.$store.dispatch('clearSelection', { type: 'textAreaEditor' });
      }
    },
  },
};
</script>
