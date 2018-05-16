import Vue from 'vue';
import Vuex from 'vuex';
// import actions from './actions';
// import mutations from './mutations';
// import getters from './getters';
import canvas from './canvas';
import file from './file';

Vue.use(Vuex);

const createStore = () => new Vuex.Store({
  state: () => ({
    touchPoints: 0,
  }),
  modules: {
    canvas,
    file,
  },
});

export default createStore;
