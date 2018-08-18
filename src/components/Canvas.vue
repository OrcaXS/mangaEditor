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
        ref="canvasContainer"
        class="canvasContainer"
        tabindex="0"
        @keyup.delete="deleteTextArea()"
      >
        <v-stage
          v-if="loadKonva"
          ref="stage"
          :config="configKonva"
          @click="stageOnClick"
        >
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
            <Balloon />
          </v-layer>
          <v-layer ref="elementsLayer">
            <TextWrapper />
          </v-layer>
          <v-layer ref="customLayer">
            <CustomTextArea />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>

<script>
import TextWrapper from '@/components/Text/TextWrapper';
import Balloon from '@/components/Balloon/Balloon';
import CustomTextArea from '@/components/Text/CustomTextArea';
// import db from '@/scripts/db';

export default {
  name: 'CanvasArea',

  components: {
    TextWrapper,
    Balloon,
    CustomTextArea,
  },

  props: {
    file: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loadKonva: false,
      oldSize: {},
      oldPos: {},
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
        width: this.$refs.scrollContainer.offsetWidth,
        height: this.$refs.scrollContainer.offsetHeight,
        // x: this.stageWidth / 2,
        // y: this.stageHeight / 2,
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
        stroke: '#451225',
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

    selected() {
      return this.$store.state.editor.selected;
    },

    selectedTextAreaIdx() {
      return this.selected.textArea;
    },

    prepareDownload() {
      return this.$store.state.editor.prepareDownload;
    },

    currentScroll() {
      return this.$store.canvas.currentCursorPosition;
    },
  },

  watch: {
    currentScale(newScale) {
      this.setScale(newScale);
    },

    selectedTextAreaIdx(newIdx) {
      if (!newIdx) {
        const stage = this.$refs.stage.getStage();
        stage.find('Transformer').destroy();
      }
    },

    prepareDownload(newVal) {
      if (newVal) {
        this.adjustCanvasForDownload();
        this.downloadImage();
        this.restoreCanvas();
      }
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
    this.loadKonva = true;
    setTimeout(() => this.setScale(this.currentScale), 0);
    setTimeout(() => this.windowResized(), 0);
    // window.setTimeout(this.adjustCanvasOnRefresh(), 10000);
    // this.fitStageIntoContainer();
    // this.fitImageIntoStage();

    this.$nextTick(() => {
      window.addEventListener('resize', this.windowResized);
    });
  },

  beforeDestroy() {
    this.$eventHub.$off('downloadImage');
  },

  updated() {
    // this.$refs.stage.getStage().batchDraw();
  },

  methods: {
    // getStageBoundingRect() {
    //   this.stageBoundingRect = this.$refs.stage.getStage().getContainer().getBoundingClientRect();
    // },

    stageOnClick(e) {
      if (!e) this.$store.dispatch('clearSelection', { type: 'clearAll' });
    },

    windowResized() {
      const stageWidth = this.$refs.stage.getStage().width();
      const stageHeight = this.$refs.stage.getStage().height();
      const {
        offsetWidth: containerWidth, offsetHeight: containerHeight,
      } = this.$refs.scrollContainer;
      if (containerWidth !== stageWidth || containerHeight !== stageHeight) {
        this.$store.dispatch('windowResized', { status: true });
      } else {
        this.$store.dispatch('windowResized', { status: false });
      }
    },

    fitStageIntoContainer() {
      this.$refs.stage.getStage().batchDraw();
      // console.log(scale * this.stageWidth);
      // console.log(scale * this.stageHeight);
      // this.$refs.stage.getStage().width(this.stageWidth * scale);
      // this.$refs.stage.getStage().height(this.stageHeight * scale);
      // this.$refs.stage.getStage().scale({ x: scale, y: scale });
      // this.$refs.stage.getStage().draw();
    },

    deleteTextArea() {
      if (this.selectedTextAreaIdx) {
        const tIdx = this.selectedTextAreaIdx;
        this.$store.dispatch('clearSelection', { type: 'clearAll' });
        this.$store.dispatch('deleteElement', {
          id: this.$route.params.file_id, idx: tIdx, type: 'textArea',
        });
      }
    },

    adjustStageSize() {
      this.$refs.stage.getStage().width(this.bgImageConfig.width + 10);
      this.$refs.stage.getStage().height(this.bgImageConfig.height + 10);
      this.$refs.stage.getStage().draw();
    },

    // fitImageIntoStage() {
    //   if (this.imageNeedResize) {
    //     const scale = this.containerSize.width / this.bgImageConfig.width;
    //     console.log(this.containerSize.width);
    //     console.log(this.bgImageConfig);
    //     this.$refs.image.getStage().width(this.bgImageConfig.width * scale);
    //     this.$refs.image.getStage().height(this.bgImageConfig.height * scale);
    //     this.$refs.image.getStage().scale({ x: scale, y: scale });
    //     this.$refs.image.getStage().draw();
    //   } else {
    //     this.$refs.image.getStage().x(160);
    //     this.$refs.image.getStage().y(50);
    //     this.$refs.image.getStage().draw();
    //   }
    // },

    setScale(scale) {
      this.$refs.stage.getStage().scale({ x: scale / 100, y: scale / 100 });
      this.$refs.stage.getStage().batchDraw();
    },

    // adjustCanvasOnRefresh() {
    //   this.adjustStageSize();
    //   this.getStageBoundingRect();
    //   this.setScale(this.zoomLevel.scale * 100);
    // },

    setCursorPosition() {
      const updatePosition = () => {
        const cursorPos = this.$refs.stage.getStage().getPointerPosition();
        this.$store.dispatch('setCursorPosition', { cursorCoordinates: cursorPos });
      };

      window.requestAnimationFrame(updatePosition);
    },

    customScroll() {
      const stage = this.$refs.stage.getStage();
      const updateScroll = () => {
        const dx = this.$refs.scrollContainer.scrollLeft;
        const dy = this.$refs.scrollContainer.scrollTop;
        this.$store.dispatch('setScrollingPosition', { dx, dy });
        stage.getStage().container().style.transform = `translate(${dx}px, ${dy}px)`;
        stage.x(-dx);
        stage.y(-dy);
        stage.batchDraw();
      };
      requestAnimationFrame(updateScroll);
    },

    canvasOnClick() {
      console.log('clickedCanvas');
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      // this.$eventHub.$emit('clickedCanvas');
    },

    adjustCanvasForDownload() {
      const stage = this.$refs.stage.getStage();
      this.oldPos = stage.getStage().position();
      this.$store.dispatch('setScrollingPosition', { dx: 0, dy: 0 });
      stage.getStage().container().style.transform = 'translate(0px, 0px)';
      stage.x(0);
      stage.y(0);
      this.setScale('100');
      this.oldSize = stage.getStage().size();
      const exportSize = this.dimension;
      stage.getStage().size(exportSize);
      // eslint-disable-next-line no-underscore-dangle
      const ctx = this.$refs.bgLayer.getStage().getContext()._context;
      ctx.imageSmoothingEnabled = false;
      stage.getStage().batchDraw();
    },

    restoreCanvas() {
      const stage = this.$refs.stage.getStage();
      this.setScale(this.currentScale);
      stage.getStage().size(this.oldSize);
      this.$store.dispatch('setScrollingPosition', { dx: (this.oldPos.x * -1), dy: (this.oldPos.y * -1) });
      stage.getStage().container().style.transform = `translate(${(this.oldPos.x * -1)}px, ${(this.oldPos.y * -1)}px)`;
      stage.position(this.oldPos);
      stage.getStage().batchDraw();

      this.$store.dispatch('prepareDownload', { status: false });
    },

    async downloadImage() {
      const stage = this.$refs.stage.getStage();
      const dataURL = stage.getStage().toDataURL({
        mimeType: 'image/jpeg',
        quality: 0.9,
        pixelRatio: 1,
      });

      const blob = await (await fetch(dataURL)).blob();
      const objectURL = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = 'stage.jpg';
      link.href = objectURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
}

.scrollContainer {
  width: 100%;
  height: calc(100vh - 3rem);
  overflow: auto;
}

.largeContainer {
  overflow: hidden;
}
</style>
