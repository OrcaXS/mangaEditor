<template>
  <div class="DefaultLayout">
    <nav class="DefaultLayout-nav">
      <button
        class="DefaultLayout-btn"
        @click="routeToHome"
      >
        <FontAwesomeIcon icon="home" />
        <span
          v-t="{ path: 'misc.home' }"
          class="DefaultLayout-text"
        />
      </button>
      <button
        class="DefaultLayout-btn"
        @click="routeToConf"
      >
        <FontAwesomeIcon icon="cog" />
        <span
          v-t="{ path: 'misc.config' }"
          class="DefaultLayout-text"
        />
      </button>
      <div class="DefaultLayout-langSelector">
        <button
          :class="{ 'DefaultLayout-btn--active': langDropdownOpened }"
          class="DefaultLayout-btn"
          @click="toggleLangDropdown"
        >
          <FontAwesomeIcon icon="language" />
          <span
            v-t="{ path: 'misc.language' }"
            class="DefaultLayout-text"
          />
          <FontAwesomeIcon icon="angle-down" />
        </button>
        <div
          v-click-outside="closeLangDropdown"
          v-if="langDropdownOpened"
          class="DefaultLayout-langDropdown">
          <ul class="list-reset">
            <li
              v-for="locale in localeList"
              :key="locale.id"
            >
              <button
                class="DefaultLayout-langmenuItem"
                @click="setLocale({ id: locale.id })"
              >
                {{ locale.text }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <slot/>
    <Adsense
      :data-ad-client="adsense.client"
      :data-ad-slot="adsense.slot" />
    <footer class="DefaultLayout-footer">
      <span v-t="{ path: 'misc.footer' }" />
      <a
        class="DefaultLayout-footerAnchor"
        href="https://github.com/OrcaXS/mangaEditor"
      >GitHub</a>
      <span v-t="{ path: 'misc.footer_ext' }" />
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LayoutDefault',
  components: {
  },
  data() {
    return {
      langDropdownOpened: false,
      localeList: [
        { id: 'zh', text: '中文' },
        { id: 'en', text: 'English' },
      ],
      adsense: {
        client: process.env.VUE_APP_ADSENSE_CLIENT,
        slot: process.env.VUE_APP_ADSENSE_SLOT,
      },
    };
  },
  methods: {
    toggleLangDropdown() {
      this.langDropdownOpened = !this.langDropdownOpened;
    },
    closeLangDropdown() {
      this.langDropdownOpened = false;
    },
    setLocale({ id }) {
      this.$i18n.locale = id;
      this.$cookie.set('locale', id);
      this.langDropdownOpened = false;
    },
    routeToConf() {
      this.$router.push({ name: 'config' });
    },
    routeToHome() {
      this.$router.push({ name: 'home' });
    },
  },
};
</script>

<style scoped lang="postcss">
/** @define DefaultLayout */
.DefaultLayout {
  display: flex;
  flex-flow: column nowrap;
}

.DefaultLayout-nav {
  background-color: theme('colors.black');
  height: 3rem;

  display: flex;
  flex-flow: row nowrap;
}

.DefaultLayout-langSelector {
  align-self: center;

  margin-left: auto;
  /* padding-right: 1rem; */
}

.DefaultLayout-text {
  padding: 0 .5em;
}

.DefaultLayout-btn {
  color: white;
  padding: 1em;

  &:hover {
    background-color: theme('colors.gray-lighter');
    color: theme('colors.black');
  }
}

.DefaultLayout-btn--active {
  padding: 1em;
  background-color: theme('colors.gray-lighter');
  color: theme('colors.black');
}

.DefaultLayout-footer {
  text-align: center;
  font-size: .9em;
  color: theme('colors.gray');
  margin: 2em 0;
}

.DefaultLayout-footerAnchor {
  color: theme('colors.gray');
}

</style>
