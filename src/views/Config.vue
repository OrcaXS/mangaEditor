<template>
  <layout-default>
    <div class="Config-Page">
      <h2
        v-t="{ path: 'config.font_management' }"
        class="Config-Heading"
      />
      <div class="Config-InputArea">
        <input
          :placeholder="fontInputPlaceHolder"
          v-model="fontInput"
          class="Config-FontInput"
        >
        <button
          v-t="{ path: 'config.add_font' }"
          class="Config-AddFontBtn"
          @click="addFontFamily"
        />
      </div>
      <div class="Config-FontList">
        <div
          v-for="(font, idx) in fontList"
          :key="idx"
          class="Config-FontItem"
        >
          <FontAwesomeIcon :icon="['fas', 'times']" />
          <span
            :style="{ fontFamily: `${font}, sans-serif` }"
            class="Config-FontName"
          >
            {{ font }}
          </span>
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
      fontInput: '',
    };
  },

  computed: {
    fontInputPlaceHolder() {
      return this.$t('config.fontname_hint');
    },
    fontList() {
      return this.$store.state.customConfig.customFonts;
    },
  },

  methods: {
    addFontFamily() {
      this.$store.dispatch('addFontFamily', { name: this.fontInput });
      this.fontInput = '';
    },
  },
};
</script>

<style scoped lang="postcss">
.Config-Page {
  padding: 1rem;
}

.Config-Heading {
  font-size: 2rem;
}

.Config-FontInput {
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
  max-width: 20em;
  &:focus {
    text-align: start;
    color: black;
  }
}

.Config-InputArea {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 1rem;
}

.Config-FontName {
  font-family: sans-serif;
}

.Config-FontItem {
  padding: .5em 0em;
}
</style>
