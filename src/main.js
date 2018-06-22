import Vue from 'vue';
import VueKonva from 'vue-konva';
import vClickOutside from 'v-click-outside';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import WebFontLoader from '@/scripts/webFontLoader';
import loadFA from '@/scripts/fontawesome';
import App from './App';
import router from './router';
import store from './store';

Vue.use(VueKonva);
Vue.use(vClickOutside);
loadFA();

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

const eventHub = new Vue();
Vue.prototype.$eventHub = eventHub;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
