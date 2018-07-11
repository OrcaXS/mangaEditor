<template>
  <div class="EditorLayout">
    <nav class="EditorLayout-topbar">
      <div class="EditorLayout-toolbar">
        <button
          class="EditorLayout-toolbarBtn"
          @click="downloadURL"
        >
          <FontAwesomeIcon icon="save" />
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="addNewTextArea"
        >
          <FontAwesomeIcon icon="plus-square" />
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="modifyZoomLevel({ type: 'decrement', zoomLevel: 10 })"
        >
          <FontAwesomeIcon icon="search-minus" />
        </button>
        <button class="EditorLayout-toolbarBtn">
          <span>{{ currentZoomLevel }}%</span>
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="modifyZoomLevel({ type: 'increment', zoomLevel: 10 })"
        >
          <FontAwesomeIcon icon="search-plus" />
        </button>
        <button class="EditorLayout-toolbarBtn">
          <span>x: {{ getCursorPosition.x }} y: {{ getCursorPosition.y }}</span>
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="resetCanvas"
        >
          <span v-t="{ path: 'editor.reset' }" />
        </button>
        <span
          v-t="{ path: 'editor.resize_msg' }"
          v-if="windowNeedResize"
          class="EditorLayout-msg"
        />
      </div>
    </nav>
    <div
      v-if="!isStorageReady"
      class="EditorLayout-mainArea"
    >
      <p>Restoring Storage...</p>
    </div>
    <div
      v-else-if="!isDbFetched"
      class="EditorLayout-mainArea"
    >
      <p>Fetching from IndexedDB...</p>
    </div>
    <div
      v-else
      class="EditorLayout-mainArea"
    >
      <aside class="EditorLayout-leftPanel">
        <LeftPanel
          :filename="currentFile.bgImage.name"
        />
      </aside>
      <CanvasArea
        ref="canvas"
        :file="currentFile"
      />
      <aside
        v-if="showRightPanel"
        class="EditorLayout-rightPanel"
      >
        <RightPanel />
      </aside>
      <TextEditor />
    </div>
  </div>
</template>

<script>
import LeftPanel from '@/components/Editor/LeftPanel';
import RightPanel from '@/components/Editor/RightPanel';
import TextEditor from '@/components/Text/TextEditor';
import CanvasArea from '@/components/Canvas';
import db from '@/scripts/db';

export default {
  name: 'EditorView',

  components: {
    LeftPanel,
    RightPanel,
    TextEditor,
    CanvasArea,
  },

  data() {
    return {
      icons: [
        'save',
        'undo',
        'redo',
        'plus-square',
        'crop',
      ],
      isStorageReady: false,
      isDbFetched: false,
      currentFile: {},
    };
  },

  computed: {
    getTouchPoints() {
      return navigator.maxTouchPoints;
    },

    currentZoomLevel() {
      return this.$store.state.canvas.zoomLevel;
    },

    getCursorPosition() {
      return this.$store.state.canvas.currentCursorPosition;
    },

    selectedTextAreaEditorIdx() {
      return this.$store.state.canvas.currentlySelected.textAreaEditor;
    },

    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    showRightPanel() {
      return this.selectedTextAreaEditorIdx || this.selectedTextAreaIdx;
    },

    windowNeedResize() {
      return this.$store.state.canvas.windowResized;
    },

    // showTextArea() {
    //   return /\d/.test(this.selectedTextAreaEditorIdx);
    // },
  },

  created() {
    this.getFile({ id: this.$route.params.file_id });
  },

  mounted() {
    const self = this;
    const id = this.$route.params.file_id;
    if (typeof this.$store.state.canvas.file[id] === 'object') {
      this.isStorageReady = true;
    } else {
    // eslint-disable-next-line no-underscore-dangle
      self.$store._vm.$root.$on('storageReady', () => {
        this.isStorageReady = true;
      });
    }
  },

  methods: {
    async getFile({ id }) {
      this.currentFile = await db.getFile({ id });
      this.isDbFetched = true;
    },

    modifyZoomLevel({ type, zoomLevel }) {
      this.$store.dispatch('modifyZoomLevel', { type, zoomLevel });
    },

    resetCanvas() {
      this.$store.dispatch('resetCanvas', { id: this.$route.params.file_id });
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      this.$eventHub.$emit('textContentUpdated', 'updateAll');
    },

    addNewTextArea() {
      this.$store.dispatch('addNewTextArea', { id: this.$route.params.file_id });
    },

    downloadURL() {
      this.$eventHub.$emit('downloadImage');
      // this.$store.dispatch('prepareDownload', { status: true });
      // const dataURL = this.$refs.canvas.$refs.stage.getStage().toDataURL();
      //
      // const link = document.createElement('a');
      // link.download = 'stage.png';
      // link.href = dataURL;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    },
  },

};
</script>

<style scoped lang="postcss">
/** @define EditorLayout */
.EditorLayout {
  display: flex;
  flex-flow: row wrap;
}

.EditorLayout-topbar {
  background-color: config('colors.peach-mono-1');
  height: 3rem;

  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}

.EditorLayout-mainArea {
  margin-top: 3rem;
  width: 100vw;
  /* height: calc(100vh - 3rem); */

  display: flex;
  flex-flow: row nowrap;
}

.EditorLayout-toolbar {
  align-self: center;

  padding-right: 1rem;
}

.EditorLayout-toolbarBtn {
  font-size: 1.125rem;
  color: white;
  padding: .875rem;

  cursor: default;

  &:hover {
    background-color: config('colors.peach');
  }
}

.EditorLayout-leftPanel {
  /* z-index: 10; */
  /* height: calc(100vw - 3rem); */
  width: 15rem;
  flex-shrink: 0;
  /* position: fixed; */
  /* top: 3rem; */

}

.EditorLayout-rightPanel {
  z-index: 10;
  height: calc(100vw - 3rem);
  width: 15rem;
  position: fixed;
  top: 3rem;
  left: calc(100vw - 15rem);
}

.EditorLayout-rightPanel--inactive {
  display: none;
}

.EditorLayout-footer {
  text-align: center;
}

.EditorLayout-msg {
  color: white;
}

</style>
