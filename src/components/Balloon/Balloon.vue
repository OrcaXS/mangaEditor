<template>
  <div v-if="balloonsLoaded">
    <v-group
      v-for="(balloon, idx) in balloons"
      :key="idx"
    >
      <v-image
        v-if="balloon.visible"
        :config="balloonConfig[idx]"
      />
      <v-rect
        v-if="idx === selectedBalloonIdx"
        :config="balloonBoundingConfig[idx]"
      />
    </v-group>
  </div>
</template>

<script>
import db from '@/scripts/db';

export default {
  name: 'Balloons',

  data() {
    return {
      balloonsLoaded: false,
      balloonBlobs: {},
    };
  },

  computed: {
    selectedBalloonIdx() {
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
      if (!this.balloonsLoaded) {
        Object.entries(this.balloons).forEach(([idx, balloon]) => {
          config[idx] = {
            width: balloon.width,
            height: balloon.height,
            x: balloon.x + 0,
            y: balloon.y + 0,
          };
        });
      } else {
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
      }
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

  beforeRouteUpdate(to, from, next) {
    this.balloonBlobs = {};
    this.balloonsLoaded = false;
    this.getBalloons();
    next();
  },

  mounted() {
    this.getBalloons();
  },

  methods: {
    async getBalloons() {
      this.balloonBlobs = {};
      this.balloonsLoaded = false;
      this.balloonBlobs = await db.getBalloons({ id: this.$route.params.file_id });
      this.balloonsLoaded = true;
    },
  },

  // watch: {
  //   selectedBalloonIdx(newIdx, oldIdx) {
  //     console.log({ oldIdx, newIdx });
  //     console.log(this.balloons);
  //     if (newIdx) {
  //       this.$store.dispatch('clearSelection', { type: 'textAreaEditor' });
  //     }
  //   },
  // },
};
</script>
