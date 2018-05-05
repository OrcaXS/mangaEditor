<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva">
      <v-layer ref="fgLayer">
        <v-image
          v-for="part in parts"
          :config="configBalloon(val.resultURL)"
        />
      </v-layer>
      <v-layer ref="bgLayer">
        <v-image :config="imageObjConfig"/>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import uploadPicture from '../scripts/upload.js';

export default {
  name: 'Canvas',
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 1000,
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
      },

      konvaObjs: {
        stage: {},
        balloons: [],
      },
    };
  },

  computed: {
    imageObjConfig() {
      const bgImage = new Image();
      bgImage.src = 'https://moeka.me/mangaEditor/results/01abcf42e7c17461d211ae0fcf6c5d3c/67684170_p3_web.jpg';
      return {
        x: 50,
        y: 50,
        image: bgImage,
        width: 1000,
        height: 1000,
      };
    },
    configBalloon(url) {
      const balloonArr = [];
      Object.keys(this.parts).forEach((key) => {

      });
      const balloonImage = new Image();
      balloonImage.src = 'https://moeka.me/mangaEditor/results/01abcf42e7c17461d211ae0fcf6c5d3c/67684170_p3_web.jpg';
      const configObj = {
        x: 50,
        y: 50,
        image: balloonImage,
        width: 1000,
        height: 1000,
      };
      return balloonArr;
    },
    parts() {
      return this.$store.file.parts;
    },

  },

  methods: {
    createBallons() {

    },
  },
};
</script>
