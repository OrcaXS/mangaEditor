<template>
  <div class="EditorLayout">
    <nav class="EditorLayout-topbar">
      <div class="EditorLayout-toolbar">
        <button
          class="EditorLayout-toolbarBtn"
          @click="routeToHome"
        >
          <FontAwesomeIcon icon="arrow-left" />
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="downloadURL"
        >
          <FontAwesomeIcon icon="save" />
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="addCustomTextArea"
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
        <!-- <button class="EditorLayout-toolbarBtn">
          <span>x: {{ getCursorPosition.x }} y: {{ getCursorPosition.y }}</span>
        </button> -->
        <button
          class="EditorLayout-toolbarBtn"
          @click="resetCanvas"
        >
          <span v-t="{ path: 'editor.reset' }" />
        </button>
        <button
          class="EditorLayout-toolbarBtn"
          @click="refreshPage"
        >
          <span
            v-t="{ path: 'editor.resize_msg' }"
            v-if="windowNeedResize"
            class="EditorLayout-msg"
          />
        </button>
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
      <div
        v-if="prepareDownload"
        class="EditorLayout-downloadModal"
      >
        <FontAwesomeIcon
          icon="spinner"
          spin
        />
        <p v-t="{ path: 'editor.prepare_download' }" />
      </div>
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

  metaInfo: {
    title: 'Editor', // set a title
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
    selected() {
      return this.$store.state.editor.selected;
    },

    currentZoomLevel() {
      return this.$store.state.canvas.zoomLevel;
    },

    showRightPanel() {
      return this.selected.textAreaEditor || this.selected.textArea;
    },

    windowNeedResize() {
      return this.$store.state.editor.windowResized;
    },

    prepareDownload() {
      return this.$store.state.editor.prepareDownload;
    },

    // showTextArea() {
    //   return /\d/.test(this.selectedTextAreaEditorIdx);
    // },
  },

  created() {
    const id = this.$route.params.file_id;
    this.getFile({ id });
  },

  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('clearSelection', { type: 'clearAll' });
    this.$store.dispatch('resetCanvasParameters');
    this.getFile({ id: to.params.file_id });
    next();
  },

  beforeDestroy() {
    this.$store.dispatch('clearSelection', { type: 'clearAll' });
    this.$store.dispatch('resetCanvasParameters');
    this.$eventHub.$off('storageReady');
  },

  mounted() {
    const id = this.$route.params.file_id;
    // this.isStorageReady = true;
    if (typeof this.$store.state.canvas.file[id] !== 'object') {
      this.$eventHub.$on('storageReady', () => {
        this.isStorageReady = true;
      });
    } else {
      this.isStorageReady = true;
      // this.$router.go();
    }
  },

  methods: {
    async getFile({ id }) {
      this.isDbFetched = false;
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

    refreshPage() {
      window.location.reload();
    },

    addCustomTextArea() {
      this.$store.dispatch('addCustomTextArea', { id: this.$route.params.file_id });
    },

    downloadURL() {
      this.$store.commit('PREPARE_DOWNLOAD', { status: true });
    },

    routeToHome() {
      this.$router.push({ name: 'home' });
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

.EditorLayout-downloadModal {
  z-index: 20;

  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2em;
}

</style>
