<template>
  <div class="RightPanel">
    <div class="RightPanel-styles">
      <div class="RightPanel-category">Text Content</div>
      <div class="RightPanel-content">
        <p v-if="selectedTextAreaIdx">{{ selectedTextArea.textContent }}</p>
        <p v-else>(empty)</p>
      </div>
      <div class="RightPanel-category">Font &amp; Styles</div>
      <div class="RightPanel-fonts">
        <div class="RightPanel-select">
          <select
            v-model="selectedFontFamily"
            name="fontFamily"
            @change="setTextAreaStyle"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Microsoft YaHei">MS YaHei</option>
          </select>
        </div>
        <div class="RightPanel-select">
          <select
            v-model="selectedFontStyle"
            name="fontStyle"
            @change="setTextAreaStyle"
          >
            <option value="normal">normal</option>
            <option value="italic">italic</option>
            <option value="oblique">oblique</option>
          </select>
        </div>
        <div class="RightPanel-select">
          <select
            v-model="selectedFontSize"
            name="fontSize"
            @change="setTextAreaStyle"
          >
            <option
              v-for="size in fontSizes"
              :key="size"
              :value="size"
            >{{ size }}</option>
          </select>
        </div>
        <div class="RightPanel-select">
          <select
            v-model="selectedFontWeight"
            name="fontWeight"
            @change="setTextAreaStyle"
          >
            <option
              v-for="size in fontWeights"
              :key="size"
              :value="size"
            >{{ size }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'EditorRightPanel',
  components: {
    FontAwesomeIcon,
  },

  data() {
    return {
      selectedFontSize: '24',
      selectedFontFamily: 'Arial',
      selectedFontStyle: 'normal',
      selectedFontWeight: '400',
      fontSizes: ['9', '10', '11', '12', '13', '14', '16', '18', '24', '30', '36', '48', '64', '72', '96', '144', '288'],
      fontWeights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    };
  },

  computed: {
    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentTextArea;
    },

    selectedTextArea() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas[this.selectedTextAreaIdx];
    },
  },

  methods: {
    setTextAreaStyle() {
      this.$store.dispatch('setTextAreaStyle', {
        id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontFamily: this.selectedFontFamily, fontStyle: this.selectedFontStyle, fontSize: this.selectedFontSize, fontWeight: this.selectedFontWeight
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.RightPanel {
  height: calc(100vw - 3rem);
  /* border: 1px solid config('colors.grey-light'); */
  background-color: config('colors.peach-lighter');
}

.RightPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  /* margin: .1rem 0; */
}

.RightPanel-layer {
  font-weight: 500;
  padding: .5rem .1rem;
  color: config('colors.grey-darker');
}

.RightPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  /* margin: .1rem 0; */
}

.RightPanel-content {
  font-weight: 500;
  padding: .5rem .1rem;
  color: config('colors.grey-darker');
}
</style>
