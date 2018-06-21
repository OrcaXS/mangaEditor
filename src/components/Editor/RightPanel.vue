<template>
  <div
    v-if="selectedTextArea"
    class="RightPanel"
  >
    <div class="RightPanel-styles">
      <div class="RightPanel-category">Text Content</div>
      <div class="RightPanel-content">
        <p v-if="selectedTextArea.textContent">{{ selectedTextArea.textContent }}</p>
        <p v-else>(empty)</p>
      </div>
      <div class="RightPanel-category">Font &amp; Styles</div>
      <div class="RightPanel-fonts">
        <div class="RightPanel-select">
          <select
            v-model="selectedTextAreaStyle.fontFamily"
            name="fontFamily"
            @change="setTextAreaStyle"
          >
            <option
              v-for="font in fontFamilies"
              :key="font.familyName"
              :value="font.familyName"
            >{{ font.displayName }}</option>
          </select>
        </div>
        <div class="RightPanel-select">
          <select
            v-model="selectedTextAreaStyle.fontStyle"
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
            v-model="selectedTextAreaStyle.fontSize"
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
            v-model="selectedTextAreaStyle.fontWeight"
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
        <div class="RightPanel-select">
          <div
            :style="currentColor"
            class="RightPanel-currentColor"
          />
          <color-picker v-model="textAreaColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'EditorRightPanel',
  components: {
    FontAwesomeIcon,
    'color-picker': Chrome,
  },

  data() {
    return {
      colors: {},
      fontFamilies: [
        { familyName: 'Arial', displayName: 'Arial' },
        { familyName: 'Helvetica', displayName: 'Helvetica' },
        { familyName: 'Comic Sans MS', displayName: 'Comic Sans MS' },
        { familyName: 'Microsoft YaHei', displayName: 'Microsoft YaHei' },
        { familyName: 'source-han-serif-japanese', displayName: 'Source Han Serif JP' },
        { familyName: 'Noto Sans Japanese', displayName: 'Noto Sans Japanese' },
      ],
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

    selectedTextAreaStyle() {
      return {
        fontSize: this.selectedTextArea.fontSize || '24',
        fontFamily: this.selectedTextArea.fontFamily || 'Arial',
        fontStyle: this.selectedTextArea.fontStyle || 'normal',
        fontWeight: this.selectedTextArea.fontWeight || '400',
      };
    },

    currentColor() {
      return {
        backgroundColor: this.textAreaColor.hex || 'black',
      };
    },

    textAreaColor: {
      get() {
        return this.selectedTextArea.colors;
      },

      set(color) {
        this.$store.dispatch('setColor', { id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, color });
      },
    },
  },

  methods: {
    setTextAreaStyle() {
      this.$store.dispatch('setTextAreaStyle', {
        id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontFamily: this.selectedFontFamily, fontStyle: this.selectedFontStyle, fontSize: this.selectedFontSize, fontWeight: this.selectedFontWeight,
      });
    },
  },
};
</script>

<style scoped lang="postcss">
@import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);

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

.RightPanel-currentColor {
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
}
</style>
