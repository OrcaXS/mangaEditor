<template>
  <div
    ref="leftPanel"
    class="LeftPanel"
  >
    <div class="LeftPanel-group">
      <div
        v-t="{ path: 'editor.custom_textarea' }"
        class="LeftPanel-category"
      />
      <div class="LeftPanel-layer">
        <div
          v-for="(textArea, idx) in customTextAreas"
          :key="idx"
          :class="{ 'LeftPanel-item--active': idx === selected.textArea }"
          class="LeftPanel-item"
        >
          <FontAwesomeIcon
            :icon="['far', 'edit']"
            class="LeftPanel-editIcon"
          />
          <span class="LeftPanel-customName">
            {{ idx }} {{ textArea.textContent }}
          </span>
          <span class="LeftPanel-layerControl">
            <button
              class="LeftPanel-layerControlBtn"
              @click="deleteElement({ type: 'textArea', idx })"
            >
              <FontAwesomeIcon icon="trash" />
            </button>
            <button
              class="LeftPanel-layerControlBtn"
              @click="toggleVisibility({ type: 'textArea', idx })"
            >
              <FontAwesomeIcon
                v-if="textArea.visible"
                icon="eye"
              />
              <FontAwesomeIcon
                v-else
                icon="eye-slash"
              />
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div
        v-t="{ path: 'editor.balloons'}"
        class="LeftPanel-category"
      />
      <div class="LeftPanel-layer">
        <div
          v-for="(balloon, bIdx) in balloons"
          :key="bIdx"
          :class="{ 'LeftPanel-elementSelected': bIdx === selected.balloon }"
          class="LeftPanel-balloonElement"
        >
          <div class="LeftPanel-item">
            <button
              class="LeftPanel-accordionBtn"
              @click="accordionOnClick({ bIdx })"
            >
              <FontAwesomeIcon
                v-if="accordionOpen.indexOf(bIdx) > -1"
                icon="caret-down"
              />
              <FontAwesomeIcon
                v-else
                icon="caret-right"
              />
            </button>
            <span
              class="LeftPanel-balloonName"
              @click="balloonOnClick(bIdx)"
            >
              <span>Balloon {{ bIdx }}</span>
            </span>
            <span class="LeftPanel-layerControl">
              <button
                class="LeftPanel-layerControlBtn"
                @click="deleteElement({ type: 'balloon', idx: bIdx })"
              >
                <FontAwesomeIcon icon="trash" />
              </button>
              <button
                class="LeftPanel-layerControlBtn"
                @click="toggleVisibility({ type: 'balloon', idx: bIdx })"
              >
                <FontAwesomeIcon
                  v-if="balloon.visible"
                  icon="eye"
                />
                <FontAwesomeIcon
                  v-else
                  icon="eye-slash"
                />
              </button>
            </span>
          </div>
          <transition-group name="list">
            <div
              v-for="(textArea, tIdx) in originalTextAreas"
              v-if="textArea.balloonIdx === parseInt(bIdx, 10) && accordionOpen.indexOf(bIdx) > -1"
              :key="tIdx"
              :class="{ 'LeftPanel-item--textArea--active': tIdx === selected.textArea }"
              class="LeftPanel-item--textArea"
            >
              <FontAwesomeIcon
                :icon="['far', 'edit']"
                class="LeftPanel-editIcon"
              />
              <span class="LeftPanel-textAreaName">
                [{{ tIdx }}] {{ textArea.textContent }}
              </span>
              <span class="LeftPanel-layerControl">
                <button
                  class="LeftPanel-layerControlBtn--alt"
                  @click="deleteElement({ type: 'textArea', idx: tIdx })"
                >
                  <FontAwesomeIcon icon="trash" />
                </button>
                <button
                  class="LeftPanel-layerControlBtn--alt"
                  @click="toggleVisibility({ type: 'textArea', idx: tIdx })"
                >
                  <FontAwesomeIcon
                    v-if="textArea.visible"
                    icon="eye"
                  />
                  <FontAwesomeIcon
                    v-else
                    icon="eye-slash"
                  />
                </button>
              </span>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div
        v-t="{ path: 'editor.background' }"
        class="LeftPanel-category"
      />
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
  props: {
    filename: {
      type: String,
      required: false,
      default: 'background_image',
    },
  },

  data() {
    return {
      accordionOpen: [],
    };
  },

  computed: {
    selected() {
      return this.$store.state.editor.selected;
    },

    currentFilename() {
      return this.$store.state.file.fileData[this.$route.params.file_id].info.filename;
    },

    balloons() {
      return this.$store.state.canvas.file[this.$route.params.file_id].balloons;
    },

    customTextAreas() {
      return this.$store.getters.getTextAreas({ id: this.$route.params.file_id, type: 'custom' });
    },

    originalTextAreas() {
      return this.$store.getters.getTextAreas({ id: this.$route.params.file_id, type: 'original' });
    },
  },

  methods: {
    accordionOnClick({ bIdx }) {
      if (this.accordionOpen.indexOf(bIdx) < 0) {
        this.accordionOpen.push(bIdx);
      } else {
        this.accordionOpen = this.accordionOpen.filter(item => item !== bIdx);
      }
    },

    textAreaOnClick(idx) {
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      this.$store.dispatch('setSelection', { type: 'textArea', idx });
    },

    balloonOnClick(idx) {
      this.$store.dispatch('clearSelection', { type: 'clearAll' });
      this.$store.dispatch('setSelection', { type: 'balloon', idx });
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
  border-right: 1px solid config('colors.peach');
  overflow: auto;
  line-height: 1.3;
}

.LeftPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  font-size: .9em;
  /* margin: .1rem 0; */
}

.LeftPanel-layer {
  font-weight: 500;
  padding: .25rem 0;
  color: config('colors.peach-mono-3');
}

.LeftPanel-balloonName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 2rem);
  margin-left: .2em;
}

.LeftPanel-elementName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 2em);
  margin-left: .5em;
}

.LeftPanel-textAreaName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 3.7em);
  margin-left: .2em;
}

.LeftPanel-customName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 3.75em);
  margin-left: .2em;
}

.LeftPanel-balloonElement {
  margin: .25rem 0;
  padding: 0 .15rem;
}

.LeftPanel-elementSelected {
  background-color: config('colors.peach-mono-3');
  color: config('colors.peach-lighter');
}

.LeftPanel-accordionBtn {
  font-size: 1.25em;
  color: unset;
}

.LeftPanel-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100%;
  padding: .1em .2em;
  font-size: .9em;
}

.LeftPanel-item--active {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100%;
  padding: .1em .2em;
  font-size: .9em;
  background-color: config('colors.peach-mono-3');
  color: config('colors.peach-lighter');
}

.LeftPanel-item--textArea {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 100%;
  font-size: .9em;
  padding: .1em 0 .1em 1.25em;
}

.LeftPanel-item--textArea--active {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  font-size: .9em;
  padding: .1em 0 .1em 1.25em;
  background-color: config('colors.peach-mono-3');
  color: config('colors.peach-lighter');
}


.LeftPanel-item--balloons {
  display: flex;
  flex-flow: row wrap;
}

.LeftPanel-layerControl {
  flex: 0 1 2rem;
  z-index: 5;
  /* margin-left: auto; */
  display: flex;
  flex-flow: row nowrap;
}

.LeftPanel-layerControlBtn {
  padding: 0 .1em;
  font-size: .9em;
  color: config('colors.peach-mono-2');
}

.LeftPanel-layerControlBtn--alt {
  padding: 0 .1em;
  font-size: .9em;
  color: config('colors.peach-light');
}

.list-enter-active, .list-leave-active {
  transition: all .2s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-1em);
}
</style>
