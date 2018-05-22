<template>
  <div class="EditorLayout">
    <nav class="EditorLayout-topbar">
      <div class="EditorLayout-toolbar">
        <button
          v-for="icon in icons"
          :key="icon"
          class="EditorLayout-toolbarBtn"
        >
          <FontAwesomeIcon :icon="['fas', icon]" />
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
      </div>
    </nav>
    <div class="EditorLayout-mainArea">
      <aside class="EditorLayout-leftPanel">
        <LeftPanel />
      </aside>
      <!-- <aside class="EditorLayout&#45;rightPanel"> -->
      <!--   <RightPanel /> -->
      <!-- </aside> -->
      <slot/>
      <!-- <CustomTextAreas /> -->
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import LeftPanel from '@/components/Editor/LeftPanel';
import RightPanel from '@/components/Editor/RightPanel';
import CustomTextAreas from '@/components/CustomTextAreas';

export default {
  name: 'LayoutEditor',

  components: {
    FontAwesomeIcon,
    LeftPanel,
    RightPanel,
    CustomTextAreas,
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
  },

  methods: {
    modifyZoomLevel({ type, zoomLevel }) {
      this.$store.dispatch('modifyZoomLevel', { type, zoomLevel });
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

.EditorLayout-footer {
  text-align: center;
}

</style>
