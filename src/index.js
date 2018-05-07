import Vue from 'vue';
import VueKonva from 'vue-konva';
import loadFA from '@/scripts/fontawesome';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueKonva);
loadFA();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
