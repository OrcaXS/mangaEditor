// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueKonva from 'vue-konva';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueKonva)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
