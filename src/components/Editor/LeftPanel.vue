<template>
  <div
    ref="leftPanel"
    class="LeftPanel"
  >
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Texts</div>
      <div class="LeftPanel-layer">
        <div
          v-for="(textArea, idx) in textAreas"
          :key="idx"
          :class="{ 'LeftPanel-elementSelected': idx === selectedTextAreaIdx }"
          class="LeftPanel-item"
        >
          <span
            class="LeftPanel-elementName"
            @click="textAreaOnClick(idx)"
          >
            <FontAwesomeIcon :icon="['far', 'edit']" />
            <span>[{{ idx }}] {{ textArea.textContent }}</span>
          </span>
          <span class="LeftPanel-layerControl">
            <button
              @click="deleteElement({ type: 'textArea', idx })"
            >
              <FontAwesomeIcon icon="trash" />
            </button>
            <button
              @click="toggleVisibility({ type: 'textArea', idx })"
            >
              <FontAwesomeIcon icon="eye" />
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Rectangles</div>
      <div class="LeftPanel-layer">
        <p>lul</p>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Balloons</div>
      <div class="LeftPanel-layer">
        <div
          v-for="(balloon, idx) in balloons"
          :key="idx"
          :class="{ 'LeftPanel-elementSelected': idx === selectedBalloonIdx }"
          class="LeftPanel-item"
        >
          <span
            class="LeftPanel-elementName"
            @click="balloonOnClick(idx)"
          >
            <FontAwesomeIcon :icon="['far', 'circle']" />
            <span>Balloon {{ idx }}</span>
          </span>
          <span class="LeftPanel-layerControl">
            <button
              @click="deleteElement({ type: 'balloon', idx })"
            >
              <FontAwesomeIcon icon="trash" />
            </button>
            <button
              @click="toggleVisibility({ type: 'balloon', idx })">
              <FontAwesomeIcon icon="eye" />
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">BG</div>
      <div class="LeftPanel-layer">
        <div class="LeftPanel-item">
          <FontAwesomeIcon :icon="['far', 'image']" />
          <span class="LeftPanel-elementName">{{ filename }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorLeftPanel',

  components: {
  },

  props: {
    filename: {
      type: String,
      required: false,
      default: 'background_image',
    },
  },

  computed: {
    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    selectedBalloonIdx() {
      return this.$store.state.canvas.currentlySelected.balloons[0];
    },

    currentFilename() {
      return this.$store.state.file.fileData[this.$route.params.file_id].info.filename;
    },

    balloons() {
      return this.$store.state.canvas.file[this.$route.params.file_id].balloons;
    },

    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
    },
  },

  methods: {
    textAreaOnClick(idx) {
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      this.$store.dispatch('setSelection', { type: 'textAreas', idx });
    },

    balloonOnClick(idx) {
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      this.$store.dispatch('setSelection', { type: 'balloons', idx });
    },

    deleteElement({ type, idx }) {
      this.$store.dispatch('deleteElement', { type, idx, id: this.$route.params.file_id });
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      // this.$eventHub.$emit('textContentUpdated', idx);
    },

    toggleVisibility({ type, idx }) {
      this.$store.dispatch('toggleElementVisibility', { type, idx, id: this.$route.params.file_id });
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
    },
  },
};
</script>

<style scoped lang="postcss">
.LeftPanel {
  height: calc(100vh - 3rem);
  /* border: 1px solid config('colors.grey-light'); */
  background-color: config('colors.peach-lighter');
}

.LeftPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  /* margin: .1rem 0; */
}

.LeftPanel-layer {
  font-weight: 500;
  padding: .5rem .1rem;
  color: config('colors.grey-darker');
}

.LeftPanel-elementName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 2rem);
}

.LeftPanel-elementSelected {
  background-color: config('colors.peach-shade-3');
}

.LeftPanel-balloons {
}

.LeftPanel-bg {
}

.LeftPanel-item {
  display: flex;
  flex-flow: row nowrap;
}

.LeftPanel-layerControl {
  flex: 0 1 2rem;
  z-index: 5;
  /* margin-left: auto; */
  display: flex;
  flex-flow: row nowrap;
}
</style>
