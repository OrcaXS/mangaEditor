<template>
  <div>
    <v-group
      v-for="(balloon, idx) in fileData.balloons"
      :key="idx"
      @click="selectBalloon(idx)"
    >
      <v-image :config="balloonConfig[idx]" />
      <v-rect
        v-if="idx === currentBalloon[0]"
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
      return this.$store.state.canvas.currentlySelected.balloon;
    },

    fileData() {
      return this.$store.state.file.fileData[this.$route.params.file_id];
    },

    balloonConfig() {
      const config = {};
      Object.entries(this.fileData.balloons).forEach(([idx, balloon]) => {
        const balloonImage = new Image();
        balloonImage.src = URL.createObjectURL(this.balloonBlobs[idx]);
        config[idx] = {
          width: balloon.boundingRect.width,
          height: balloon.boundingRect.height,
          image: balloonImage,
          x: balloon.boundingRect.x + 0,
          y: balloon.boundingRect.y + 0,
        };
      });
      return config;
    },

    balloonBoundingConfig() {
      const config = {};
      Object.entries(this.fileData.balloons).forEach(([idx, balloon]) => {
        config[idx] = {
          width: balloon.boundingRect.width,
          height: balloon.boundingRect.height,
          x: balloon.boundingRect.x + 0,
          y: balloon.boundingRect.y + 0,
          stroke: 'skyblue',
          strokeWidth: 5,
        };
      });
      return config;
    },
  },

  mounted() {

  },

  methods: {
    selectBalloon(idx) {
      this.$store.dispatch('setSelection', { type: 'balloon', idx });
    },
  },
};
</script>
