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
            @click="canvasOnClick"
          >
            <v-image
              ref="image"
              :config="bgImageConfig"
            />
          </v-layer>
          <v-layer
            ref="balloonsLayer"
          >
            <Balloon
              :balloon-blobs="file.balloons"
            />
          </v-layer>
          <v-layer ref="elementsLayer">
            <TextWrapper :stage-bounding-rect="stageBoundingRect"/>
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>

<script>
import TextWrapper from '@/components/TextWrapper';
import Balloon from '@/components/Balloon/Balloon';
import db from '@/scripts/db';

export default {
  name: 'CanvasArea',

  components: {
    TextWrapper,
    Balloon,
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
        width: this.bgImageConfig.width + 0,
        height: this.bgImageConfig.height + 0,
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
        x: 0,
        y: 0,
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
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    selectedTextAreaEditorIdx() {
      return this.$store.state.canvas.currentlySelected.textAreaEditor;
    },

    selectedBalloonIdx() {
      return this.$store.state.canvas.currentlySelected.balloons[0];
    },
  },

  watch: {
    currentScale(newScale) {
      this.setScale(newScale);
    },

    selectedBalloonIdx(newIdx) {

    },

    selectedTextAreaIdx(newIdx) {

    },

    selectedTextAreaEditorIdx(newIdx) {

    },
  },

  created() {
    const typekitScript = document.createElement('script');
    typekitScript.innerHTML = `
      (function(d) {
      var config = {
        kitId: 'wkh8kxi',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);
    `;
    document.head.appendChild(typekitScript);
  },

  mounted() {
    this.setScale(this.currentScale);
    // this.$eventHub.$on('clicked1Canvas', () => {
    //   console.log({ textAreaIdx: this.selectedTextAreaIdx, textAreaEditorIdx: this.selectedTextAreaEditorIdx, balloonIdx: this.selectedBalloonIdx });
    //   if (this.selectedTextAreaIdx && !this.selectedTextAreaEditorIdx) {
    //     this.$eventHub.$emit('textContentUpdated', this.selectedTextAreaIdx);
    //     this.$store.dispatch('clearSelection', { type: 'clearAll' });
    //   }
    //   if (!this.selectedTextAreaIdx && !this.selectedTextAreaEditorIdx) {
    //     // console.log('clearAll');
    //     this.$store.dispatch('clearSelection', { type: 'clearAll' });
    //   }
    // });

    // window.setTimeout(this.adjustCanvasOnRefresh(), 10000);
    // this.fitStageIntoContainer();
    // this.fitImageIntoStage();
    // this.$nextTick(() => {
    //   window.addEventListener('resize', this.fitStageIntoContainer);
    // });
  },

  beforeDestroy() {
    // this.$eventHub.$off('clickedCanvas');
  },


  methods: {
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

    canvasOnClick(e) {
      console.log('clickedCanvas');
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      // this.$eventHub.$emit('clickedCanvas');
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
