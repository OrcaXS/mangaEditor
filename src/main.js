import Vue from 'vue';
import VueKonva from 'vue-konva';
import vClickOutside from 'v-click-outside';
import VueI18n from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import WebFontLoader from '@/scripts/webFontLoader';
import loadFA from '@/scripts/fontawesome';
import en from '@/i18n/en.json';
import ja from '@/i18n/ja.json';
import zh from '@/i18n/zh.json';

import App from './App';
import router from './router';
import store from './store';

Vue.use(VueKonva);
Vue.use(vClickOutside);
Vue.use(VueI18n);
loadFA();

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

const eventHub = new Vue();
Vue.prototype.$eventHub = eventHub;

const localeStrings = { en, zh };

const i18n = new VueI18n({
  locale: 'en',
  messages: localeStrings,
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  i18n,
  template: '<App/>',
});
