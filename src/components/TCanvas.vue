<template>
  <LayoutEditor>
    <div
      ref="canvasArea"
      class="Canvas"
      @wheel.prevent="zoom"
    >
      <v-stage
        ref="stage"
        :config="configKonva"
      >
        <v-layer ref="bgLayer">
          <v-image
            ref="image"
            :config="bgImageConfig"
          />
        </v-layer>
      </v-stage>
    </div>
  </LayoutEditor>
</template>

<script>
import LayoutEditor from '@/layouts/Editor';

export default {
  name: 'TCanvas',

  components: {
    LayoutEditor,
  },

  data() {
    return {
      stageWidth: 1000,
      stageHeight: 1000,
      number: 200,
      zoomLevel: {
        posX: 0,
        posY: 0,
        scale: 1,
      },
      konvaObjs: {
        stage: {},
        balloons: [],
      },
    };
  },

  computed: {
    imageNeedResize() {
      return this.bgImageConfig.width > this.containerSize.width;
    },

    containerSize() {
      return {
        width: this.$refs.canvasArea.offsetWidth,
        height: this.$refs.canvasArea.offsetHeight,
      };
    },

    configKonva() {
      return {
        width: this.stageWidth,
        height: this.stageHeight,
        x: this.stageWidth / 2,
        y: this.stageHeight / 2,
        offset: {
          x: this.stageWidth / 2,
          y: this.stageHeight / 2,
        },
      };
    },

    bgImageConfig() {
      const bgImage = new Image();
      bgImage.src = 'http://example.com/test.jpg';
      return {
        x: 300,
        y: 50,
        image: bgImage,
        width: 1208,
        height: 904,
      };
    },

  },

  created() {
  },

  mounted() {
    this.fitImageIntoContainer();
    // this.fitStageIntoContainer();
    // this.$nextTick(() => {
    //   window.addEventListener('resize', this.fitStageIntoContainer);
    // });
  },

  beforeDestroy() {
    // window.removeEventListener('resize', this.fitStageIntoContainer);
  },

  methods: {
    fitStageIntoContainer() {
      const scale = this.containerSize.width / this.stageWidth;
      this.$refs.stage.getStage().width(this.stageWidth * scale);
      this.$refs.stage.getStage().height(this.stageHeight * scale);
      this.$refs.stage.getStage().scale({ x: scale, y: scale });
      this.$refs.stage.getStage().draw();
    },

    fitImageIntoContainer() {
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

    getDistance(p1, p2) {
      return Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
    },

    zoom(e) {
      // console.log(e);
      if (e.ctrlKey) {
        this.zoomLevel.scale -= e.deltaY * 0.01;
      } else {
        this.zoomLevel.posX -= e.deltaX;
        this.zoomLevel.posY -= e.deltaY;
      }
      console.log(this.zoomLevel.posX);
      console.log(this.zoomLevel.posY);
      const update = () => {
        this.$refs.canvasArea.style.transform = `translate(${this.zoomLevel.posX}px, ${this.zoomLevel.posY}px)`;
        this.$refs.stage.getStage().x(this.zoomLevel.posX);
        this.$refs.stage.getStage().y(this.zoomLevel.posY);
        this.$refs.stage.getStage().batchDraw();
        this.$store.dispatch('setZoomLevel', { zoomLevel: this.zoomLevel.scale });
        this.$refs.stage.getStage().width(this.stageWidth * this.zoomLevel.scale);
        this.$refs.stage.getStage().height(this.stageHeight * this.zoomLevel.scale);
        this.$refs.stage.getStage().scale({ x: this.zoomLevel.scale, y: this.zoomLevel.scale });
      };

      window.requestAnimationFrame(update);
    },

    customScroll(e) {
      const dx = this.$refs.scrollContainer.scrollLeft;
      const dy = this.$refs.scrollContainer.scrollTop;
      this.$refs.stage.container().style.transform = `translate(${dx}px, ${dy}px)`;
      this.$refs.stage.x(-dx);
      this.$refs.stage.y(-dy);
      this.$refs.stage.batchDraw();
    },

    setStageSize() {
      this.stageWeight = this.$refs.canvasArea.offsetWidth;
      this.stageHeight = this.$refs.canvasArea.offsetHeight;
    },
  },

};
</script>

<style scoped lang="postcss">
.Canvas {
  width: 100%;
  overflow: auto;

  & canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
