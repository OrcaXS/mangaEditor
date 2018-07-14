<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.setLocale();
  },
  methods: {
    setLocale() {
      const cookieLocale = this.$cookie.get('locale') || 'en';
      if (cookieLocale !== this.$i18n.locale) {
        this.$i18n.locale = cookieLocale;
      }
    },
  }
};
</script>

<style>
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<style src="@/assets/tailwind.css"></style>
