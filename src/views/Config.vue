<template>
  <layout-default>
    <div class="Config-page">
      <h2
        v-t="{ path: 'config.font_management' }"
        class="Config-heading"
      />
      <p
        v-t="{ path: 'config.font_explanation' }"
        class="Config-explanation"
      />
      <div class="Config-mainArea">
        <form
          class="Config-inputArea"
          @submit="checkForm"
        >
          <input
            id="fontname"
            :placeholder="fontInputPlaceHolder"
            v-model="fontInput"
            class="Config-fontInput"
            type="text"
            name="fontname"
            required
          >
          <input
            :value="$t('config.add_font')"
            type="submit"
            class="Config-addFontBtn"
          >
        </form>
        <div
          :style="selectedFontStyle"
          class="Config-testArea"
        >
          <p lang="zh-cn">朝辞白帝彩云间</p>
          <p lang="zh-tw">朝辭白帝彩雲間</p>
          <p lang="ja-JP">朝に辭す白帝彩雲の間</p>
          <p lang="en-US">The quick brown fox jumps over the lazy dog</p>
        </div>
      </div>
      <div class="Config-fontList">
        <div
          v-for="(font, idx) in fontList"
          :key="idx"
          class="Config-fontItem"
        >
          <button>
            <FontAwesomeIcon
              :icon="['fas', 'times']"
              @click="removeFontFamily({ idx })"
            />
          </button>
          <button
            :style="{ fontFamily: `${font}, sans-serif` }"
            :class="[ idx === selectedFontFamilyIdx ? 'Config-fontName--selected' : 'Config-fontName']"
            @click="selectFont({ idx })"
          >
            {{ font }}
          </button>
        </div>
      </div>
    </div>
  </layout-default>
</template>

<script>
import LayoutDefault from '@/layouts/Default';

export default {
  name: 'ConfigView',
  components: {
    LayoutDefault,
  },
  data() {
    return {
      fontInput: null,
      selectedFontFamilyIdx: null,
    };
  },

  computed: {
    fontInputPlaceHolder() {
      return this.$t('config.fontname_hint');
    },
    fontList() {
      return this.$store.state.customConfig.customFonts;
    },
    selectedFont() {
      return this.selectedFontFamilyIdx !== null ? this.fontList[this.selectedFontFamilyIdx] : 'sans-serif';
    },
    selectedFontStyle() {
      return {
        fontFamily: `${this.selectedFont}, 'sans-serif'`,
      };
    },
  },

  methods: {
    addFontFamily() {
      const re = /[\w-_\s]+/g;
      this.$store.dispatch('addFontFamily', { name: this.fontInput.match(re).join('') });
      this.fontInput = '';
    },
    removeFontFamily({ idx }) {
      this.$store.dispatch('removeFontFamily', { idx: parseInt(idx, 10) });
      this.selectedFontFamilyIdx = null;
    },
    selectFont({ idx }) {
      this.selectedFontFamilyIdx = idx;
    },
    checkForm(e) {
      e.preventDefault();
      if (this.fontInput) {
        this.addFontFamily();
        return true;
      }
      return false;
    }
  },
};
</script>

<style scoped lang="postcss">
.Config-page {
  padding: 1rem;
}

.Config-heading {
  font-size: 2rem;
  margin-bottom: .5rem;
}

.Config-fontInput {
  width: 100%;
  display: block;
  font-size: 1em;
  text-align: start;
  border-radius: 5px;
  color: #999999;
  /* border: 0px solid #999999; */
  border: none;
  background-color: #f0f0f0;
  height: 2.25em;
  padding: 0em .5em;
  appearance: none;
  max-width: 21.25em;
  &:focus {
    text-align: start;
    color: black;
  }
}

.Config-explanation {
  max-width: 40em;
}

.Config-inputArea {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 1rem 1rem 1rem 0;
  flex: 2 0 auto;
}

.Config-mainArea {
  display: flex;
  flex-flow: row wrap;
  margin-bottom: .5rem;
}

.Config-testArea {
}

.Config-fontItem {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: .25em 0em;
}
</style>
