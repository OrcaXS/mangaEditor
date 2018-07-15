<template>
  <div
    class="RightPanel"
  >
    <div class="RightPanel-styles">
      <div
        v-t="{ path: 'editor.text_styles' }"
        class="RightPanel-category"
      />
      <div class="RightPanel-fonts">
        <div class="RightPanel-select--fontFamily">
          <select
            v-model="fontFamily"
            name="fontFamily"
            @change="onStyleChange"
          >
            <optgroup :label="$t('editor.preset')">
              <option
                v-for="font in presetFonts"
                :key="font.familyName"
                :value="font.familyName"
              >{{ font.displayName }}</option>
            </optgroup>
            <optgroup :label="$t('editor.custom')">
              <option
                v-for="font in customFonts"
                :key="font"
                :value="font"
              >{{ font }}</option>
            </optgroup>
          </select>
        </div>
        <div class="RightPanel-select--fontSize">
          <select
            v-model="fontSize"
            name="fontSize"
            @change="onStyleChange"
          >
            <option
              v-for="size in fontSizes"
              :key="size"
              :value="size"
            >{{ size }}</option>
          </select>
        </div>
        <div class="RightPanel-select--fontStyle">
          <select
            v-model="fontStyle"
            name="fontStyle"
            @change="onStyleChange"
          >
            <option
              v-for="style in fontStyles"
              :key="style"
              :value="style"
            >{{ style }}</option>
          </select>
        </div>
      </div>

      <div
        v-t="{ path: 'editor.colors' }"
        class="RightPanel-category"
      />
      <div class="RightPanel-colors">
        <div class="RightPanel-colorType">
          <p
            v-t="{ path: 'editor.foreground' }"
            class="RightPanel-description"
          />
          <div
            :style="currentFgColor"
            class="RightPanel-currentColor"
            @click="toggleColorPicker({ type: 'fg' })"
          />
        </div>
        <div class="RightPanel-colorType">
          <div>
            <p
              v-t="{ path: 'editor.background' }"
              class="RightPanel-description"
            />
            <div
              :style="currentBgColor"
              class="RightPanel-currentColor"
              @click="toggleColorPicker({ type: 'bg' })"
            />
          </div>
        </div>
        <color-picker
          v-show="showFgColorPicker"
          v-model="textAreaFgColor"
          class="RightPanel-colorPicker"
        />
        <color-picker
          v-show="showBgColorPicker"
          v-model="textAreaBgColor"
          class="RightPanel-colorPicker"
        />
      </div>
      <div
        v-t="{ path: 'editor.text_content' }"
        class="RightPanel-category"
      />
      <div class="RightPanel-content">
        <p v-if="selectedTextArea.textContent">{{ selectedTextArea.textContent }}</p>
        <p v-else>(empty)</p>
      </div>
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
      showFgColorPicker: false,
      showBgColorPicker: false,
      presetFonts: [
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
      return this.$store.state.canvas.currentlySelected.textAreas[0] || this.$store.state.canvas.currentlySelected.textAreaEditor;
    },

    selectedTextArea() {
      return this.$store.state.canvas.file[this.$route.params.file_id].textAreas[this.selectedTextAreaIdx];
    },

    rgbaColors() {
      const rgba = this.$store.getters.getRgbaColors({
        id: this.$route.params.file_id, idx: this.selectedTextAreaIdx,
      });
      return rgba;
    },

    currentFgColor() {
      return {
        backgroundImage: `linear-gradient(${this.rgbaColors.fgColor},${this.rgbaColors.fgColor}),
        url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC')`,
      };
    },

    currentBgColor() {
      return {
        backgroundImage: `linear-gradient(${this.rgbaColors.bgColor},${this.rgbaColors.bgColor}),
        url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC')`,
      };
    },

    customFonts() {
      return this.$store.state.customConfig.customFonts;
    },

    // fontList() {
    //   const fonts = this.customFonts.map(fontName => ({ familyName: fontName, displayName: fontName }));
    //   return [...this.presetFontFamilies, ...fonts];
    // },
    //
    textAreaFgColor: {
      get() {
        return this.selectedTextArea.fgColors;
      },

      set(colors) {
        this.$store.dispatch('setColor', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, type: 'fg', colors,
        });
      },
    },

    textAreaBgColor: {
      get() {
        return this.selectedTextArea.bgColors;
      },

      set(colors) {
        this.$store.dispatch('setColor', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, type: 'bg', colors,
        });
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
        return this.selectedTextArea.fontSize || '24';
      },

      set(val) {
        this.$store.dispatch('setTextAreaStyle', {
          id: this.$route.params.file_id, idx: this.selectedTextAreaIdx, fontSize: val,
        });
      },
    },
  },

  methods: {
    onStyleChange(e) {
      this.$eventHub.$emit('textContentUpdated', this.selectedTextAreaIdx);
    },
    toggleColorPicker({ type }) {
      if (type === 'fg') {
        this.showBgColorPicker = false;
        this.showFgColorPicker = !this.showFgColorPicker;
      } else if (type === 'bg') {
        this.showBgColorPicker = !this.showBgColorPicker;
        this.showFgColorPicker = false;
      } else {
        this.showBgColorPicker = false;
        this.showFgColorPicker = false;
      }
    },
  },

};
</script>

<style scoped lang="postcss">
@import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);

.RightPanel {
  font-size: 0.85rem;
  /* border: 1px solid config('colors.grey-light'); */
  background-color: config('colors.peach-lighter');
  box-shadow: -2px 2px 10px 1px rgba(0,0,0,0.4);
  border-radius: 1px;
  border: 1px solid config('colors.peach');
  overflow: auto;
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
  height: 2rem;
  border-radius: 2px;
}

.RightPanel-colorType {
  width: 50%;
}

.RightPanel-fonts {
  display: flex;
  flex-flow: row wrap;
}

.RightPanel-colors {
  display: flex;
  flex-flow: row wrap;
  padding: .5rem;
}

.RightPanel-description {
  color: config('colors.peach-mono-3');
  text-align: center;
  padding-bottom: .2em;
  font-size: .9em;
}

</style>
