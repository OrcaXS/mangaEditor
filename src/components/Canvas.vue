<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva">
      <v-layer ref="bgLayer">
        <v-image :config="bgImageConfig"/>
      </v-layer>
      <v-layer ref="fgLayer">
        <v-image
          v-for="balloon in fileData.balloons"
          :key="balloonCoordinate(balloon)"
          :config="configBalloon(balloon)"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: 'Canvas',
  data() {
    return {
      konvaObjs: {
        stage: {},
        balloons: [],
      },
    };
  },

  computed: {
    configKonva() {
      return {
        width: this.dimension.width,
        height: this.dimension.height,
      };
    },

    bgImageConfig() {
      const bgImage = new Image();
      bgImage.src = this.fileData.info.filename;
      return {
        x: 0,
        y: 0,
        image: bgImage,
        width: this.dimension.width,
        height: this.dimension.height,
      };
    },

    fileData() {
      return this.$store.state.file.fileData[this.$route.params.file_id];
    },

    dimension() {
      return {
        width: this.fileData.info.dim.cols,
        height: this.fileData.info.dim.rows,
      };
    },

    localBlob() {
      return this.$store.state.file.localBlob;
    },

    balloons() {
      return this.fileData.balloons;
    },
  },

  methods: {
    createBallons() {

    },
    configBalloon(balloon) {
      const balloonImage = new Image();
      balloonImage.src = balloon.resultURL;
      const configObj = {
        x: balloon.boundingRect.x,
        y: balloon.boundingRect.y,
        image: balloonImage,
        width: balloon.boundingRect.width,
        height: balloon.boundingRect.height,
        stroke: 'black',
        strokeWidth: 4,
        shadowOffsetX: 20,
        shadowOffsetY: 25,
        shadowBlur: 40,
        opacity: 0.5,
      };
      return configObj;
    },

    balloonCoordinates(balloon) {
      return `${balloon.boundingRect.x},${balloon.boundingRect.y}`;
    },
  },
};
</script>
