import Vue from 'vue';
import VueKonva from 'vue-konva';
import vClickOutside from 'v-click-outside';
import WebFontLoader from '@/scripts/webFontLoader';
import loadFA from '@/scripts/fontawesome';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueKonva);
Vue.use(vClickOutside);
loadFA();

const eventHub = new Vue();
Vue.prototype.$eventHub = eventHub;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
