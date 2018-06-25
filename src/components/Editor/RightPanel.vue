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
            v-model="fontFamily"
            name="fontFamily"
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
            v-model="fontSize"
            name="fontSize"
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
            v-model="fontStyle"
            name="fontStyle"
          >
            <option
              v-for="style in fontStyles"
              :key="style"
              :value="style"
            >{{ style }}</option>
          </select>
        </div>
        <div class="RightPanel-select">
          <div
            :style="currentColor"
            class="RightPanel-currentColor"
          />
          <color-picker
            v-model="textAreaColor"
          />
        </div>
      </div>
      <div class="RightPanel-category">Position &amp; Style</div>
      <p class="RightPanel-content">x: {{ selectedTextArea.x }}</p>
      <p class="RightPanel-content">y: {{ selectedTextArea.y }}</p>
      <p class="RightPanel-content">width: {{ selectedTextArea.width }}</p>
      <p class="RightPanel-content">height: {{ selectedTextArea.height }}</p>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
  name: 'EditorRightPanel',
  components: {
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
      fontStyles: ['normal', 'italic', 'oblique', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    };
  },

  computed: {
    selectedTextAreaIdx() {
      return this.$store.state.canvas.currentlySelected.textAreas[0];
    },

    selectedTextArea() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas[this.selectedTextAreaIdx];
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

    fontStyle: {
      get() {
        return this.selectedTextArea.fontStyle || 'normal';
      },

      set(val) {
        this.$store.dispatch('setTextAreaStyle', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontStyle: val,
        });
      },
    },

    fontFamily: {
      get() {
        return this.selectedTextArea.fontFamily || 'Arial';
      },

      set(val) {
        this.$store.dispatch('setTextAreaStyle', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontFamily: val,
        });
      },
    },

    fontSize: {
      get() {
        return this.selectedTextArea.fontSize || '30';
      },

      set(val) {
        this.$store.dispatch('setTextAreaStyle', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontSize: val,
        });
      },
    },
  },

  methods: {
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
