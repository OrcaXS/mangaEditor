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
        >
          <FontAwesomeIcon :icon="['far', 'edit']" />
          <span class="LeftPanel-elementName">({{ idx }}) {{ textArea.textContent }}</span>
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
        >
          <FontAwesomeIcon :icon="['far', 'circle']" />
          Balloon {{ idx }}
          <span class="LeftPanel-layerControl">
            <FontAwesomeIcon icon="trash" />
            <FontAwesomeIcon icon="eye" />
          </span>
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">BG</div>
      <div class="LeftPanel-layer">
        <FontAwesomeIcon :icon="['far', 'image']" />
        {{ filename }}
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

    currentFilename() {
      return this.$store.state.file.fileData[this.$route.params.file_id].info.filename;
    },

    balloons() {
      return this.$store.state.file.fileData[this.$route.params.file_id].balloons;
    },

    textAreas() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas;
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
  word-break: break-all;
}

.LeftPanel-elementSelected {
  background-color: config('colors.peach-shade-3');
}

.LeftPanel-balloons {
}

.LeftPanel-bg {
}
</style>
