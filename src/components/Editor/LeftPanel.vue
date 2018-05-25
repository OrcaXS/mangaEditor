<template>
  <div
    ref="leftPanel"
    class="LeftPanel"
  >
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Elements</div>
      <div class="LeftPanel-layer">
        <div
          v-for="(textArea, idx) in textAreas"
          :key="idx"
        >
          <FontAwesomeIcon :icon="['far', 'circle']" />
          {{ textArea.x }} & {{ textArea.y }}
        </div>
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
          {{ idx }}
        </div>
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">BG</div>
      <div class="LeftPanel-layer">
        <FontAwesomeIcon :icon="['far', 'image']" />
        {{ currentFilename }}
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'EditorLeftPanel',
  components: {
    FontAwesomeIcon,
  },

  computed: {
    currentFilename() {
      return this.$store.state.file.fileData[this.$route.params.file_id].info.filename;
    },

    balloons() {
      return this.$store.state.file.fileData[this.$route.params.file_id].balloons;
    },

    textAreas() {
      return this.$store.state.canvas.textAreas;
    },
  },
};
</script>

<style scoped lang="postcss">
.LeftPanel {
  height: calc(100vw - 3rem);
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

.LeftPanel-balloons {
}

.LeftPanel-bg {
}
</style>
