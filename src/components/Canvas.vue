<template>
  <div
    ref="scrollContainer"
    class="scrollContainer"
    @scroll="customScroll"
  >
    <div
      :style="containerStyle"
      class="largeContainer"
    >
      <div
        ref="canvasArea"
        class="canvasContainer"
      >
        <v-stage
          ref="stage"
          :config="configKonva"
        >
          <v-layer ref="frameLayer">
            <v-rect
              ref="frame"
              :config="configFrame"
            />
          </v-layer>
          <v-layer
            ref="bgLayer"
          >
            <v-image
              ref="image"
              :config="bgImageConfig"
            />
          </v-layer>
          <v-layer
            ref="balloonsLayer"
          >
            <v-image
              v-for="(balloon, idx) in fileData.balloons"
              :key="balloonCoordinate(balloon)"
              :config="configBalloon(balloon, idx)"
            />
          </v-layer>
          <v-layer ref="elementsLayer">
            <TestText :stage-bounding-rect="stageBoundingRect"/>
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>

<script>
import TestText from '@/components/TText';
import db from '@/scripts/db';

export default {
  name: 'CanvasArea',

  components: {
    TestText,
  },

  props: {
    file: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      // file: {},
      // stageWidth: window.innerWidth,
      // stageHeight: window.innerHeight,
      zoomLevel: {
        posX: 0,
        posY: 0,
        scale: this.$store.state.canvas.zoomLevel ? this.$store.state.canvas.zoomLevel / 100 : 1,
        scaleBy: 1.01,
      },
      konvaObjs: {
        stage: {},
        balloons: [],
      },
      stageBoundingRect: new DOMRect(),
    };
  },

  computed: {
    imageNeedResize() {
      return this.bgImageConfig.width > this.containerSize.width;
    },

    containerSize() {
      return {
        width: this.$refs.scrollContainer.offsetWidth,
        height: this.$refs.scrollContainer.offsetHeight,
      };
    },

    configKonva() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        // x: this.stageWidth / 2,
        // y: this.stageHeight / 2,
        offset: {
          // x: this.stageWidth / 2,
          // y: this.stageHeight / 2,
        },
      };
    },

    configFrame() {
      return {
        width: this.bgImageConfig.width + 100,
        height: this.bgImageConfig.height + 100,
        // x: this.stageWidth / 2,
        // y: this.stageHeight / 2,
        stroke: 'blue',
        strokeWidth: 10,
      };
    },

    bgImageConfig() {
      const bgImage = new Image();
      bgImage.src = URL.createObjectURL(this.file.bgImage);
      return {
        x: 50,
        y: 50,
        image: bgImage,
        width: this.dimension.width,
        height: this.dimension.height,
        stroke: 'red',
        strokeWidth: 10,
      };
    },

    currentScale() {
      return this.$store.state.canvas.zoomLevel;
    },

    containerStyle() {
      return {
        width: `calc(${(this.bgImageConfig.width + 100) * (this.currentScale / 100)}px + 15rem)`,
        height: `${(this.bgImageConfig.height + 100) * (this.currentScale / 100)}px`,
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

    localImage() {
      return this.fileData.localImageEncoded;
    },

    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentTextArea;
    },

  },

  watch: {
    currentScale(newScale) {
      this.setScale(newScale);
    },
  },

  mounted() {
    this.setScale(this.currentScale);

    const self = this;
    self.$root.$on('charConfigUpdated', () => {
      console.log('charConfigUpdated');
    });

    // self.$refs.elementsLayer.getStage().draw();
    // TODO
    // if (this.isStorageRestored) {
    //   this.adjustCanvasOnRefresh();
    // }
    // window.setTimeout(this.adjustCanvasOnRefresh(), 10000);
    // this.fitStageIntoContainer();
    // this.fitImageIntoStage();
    // this.$nextTick(() => {
    //   window.addEventListener('resize', this.fitStageIntoContainer);
    // });
  },


  methods: {
    configBalloon(balloon, idx) {
      const balloonImage = new Image();
      balloonImage.src = URL.createObjectURL(this.file.balloons[idx]);
      const configObj = {
        x: balloon.boundingRect.x + 50,
        y: balloon.boundingRect.y + 50,
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

    balloonCoordinate(balloon) {
      return `${balloon.boundingRect.x},${balloon.boundingRect.y}`;
    },

    getStageBoundingRect() {
      this.stageBoundingRect = this.$refs.stage.getStage().getContainer().getBoundingClientRect();
    },

    fitStageIntoContainer() {
      const scale = this.containerSize.width / this.stageWidth;
      console.log(scale);
      console.log(scale * this.stageWidth);
      console.log(scale * this.stageHeight);
      // this.$store.dispatch('setZoomLevel', { type: 'set', zoomLevel: scale });
      this.$refs.stage.getStage().width(this.stageWidth * scale);
      this.$refs.stage.getStage().height(this.stageHeight * scale);
      this.$refs.stage.getStage().scale({ x: scale, y: scale });
      this.$refs.stage.getStage().draw();
    },

    adjustStageSize() {
      this.$refs.stage.getStage().width(this.bgImageConfig.width + 10);
      this.$refs.stage.getStage().height(this.bgImageConfig.height + 10);
      this.$refs.stage.getStage().draw();
    },

    fitImageIntoStage() {
      if (this.imageNeedResize) {
        const scale = this.containerSize.width / this.bgImageConfig.width;
        console.log(this.containerSize.width);
        console.log(this.bgImageConfig);
        this.$refs.image.getStage().width(this.bgImageConfig.width * scale);
        this.$refs.image.getStage().height(this.bgImageConfig.height * scale);
        this.$refs.image.getStage().scale({ x: scale, y: scale });
        this.$refs.image.getStage().draw();
      } else {
        this.$refs.image.getStage().x(160);
        this.$refs.image.getStage().y(50);
        this.$refs.image.getStage().draw();
      }
    },

    setScale(scale) {
      this.$refs.stage.getStage().scale({ x: scale / 100, y: scale / 100 });
      this.$refs.stage.getStage().batchDraw();
    },

    adjustCanvasOnRefresh() {
      this.adjustStageSize();
      this.getStageBoundingRect();
      this.setScale(this.zoomLevel.scale * 100);
    },

    setCursorPosition(e) {
      const updatePosition = () => {
        const cursorPos = this.$refs.stage.getStage().getPointerPosition();
        this.$store.dispatch('setCursorPosition', { cursorCoordinates: cursorPos });
      };

      window.requestAnimationFrame(updatePosition);
    },

    customScroll(e) {
      const updateScroll = () => {
        const dx = this.$refs.scrollContainer.scrollLeft;
        const dy = this.$refs.scrollContainer.scrollTop;
        this.$store.dispatch('setScrollingPosition', { dx, dy });
        this.$refs.stage.getStage().container().style.transform = `translate(${dx}px, ${dy}px)`;
        this.$refs.stage.getStage().x(-dx);
        this.$refs.stage.getStage().y(-dy);
        this.$refs.stage.getStage().batchDraw();
      };
      window.requestAnimationFrame(updateScroll);
    },
  },

};
</script>

<style scoped lang="postcss">
.downloadContainer {
  position: absolute;
  top: 100px;
  left: calc(100vw - 5rem);
}

.canvasContainer {
  border: 1px solid black;
}

.scrollContainer {
  width: 100%;
  height: calc(100vh - 3rem);
  overflow: auto;
}

.largeContainer {
  /* width: 2000px; */
  /* height: 2000px; */
  overflow: hidden;
}
</style>
