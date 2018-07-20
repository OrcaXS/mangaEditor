import Vue from 'vue';
import VueKonva from 'vue-konva';
import vClickOutside from 'v-click-outside';
import VueI18n from 'vue-i18n';
import VueCookie from 'vue-cookie';
import VueAnalytics from 'vue-analytics';
import Meta from 'vue-meta';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import WebFontLoader from '@/scripts/webFontLoader';
import loadFA from '@/scripts/fontawesome';
import en from '@/i18n/en.json';
import ja from '@/i18n/ja.json';
import zh from '@/i18n/zh.json';

import App from './App';
import router from './router';
import store from './store';

// Vue.config.devtools = true;

Vue.use(VueKonva);
Vue.use(vClickOutside);
Vue.use(VueI18n);
Vue.use(VueCookie);
Vue.use(VueAnalytics, {
  id: 'UA-***REMOVED***-1',
  router,
  autoTracking: {
    screenview: true
  },
});
Vue.use(Meta, {
  keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-vue-meta', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-vue-meta-server-rendered', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'vmid', // the property name that vue-meta uses to determine whether to overwrite or append a tag
});
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
