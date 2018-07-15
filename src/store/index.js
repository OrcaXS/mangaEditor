import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
// import actions from './actions';
// import mutations from './mutations';
// import getters from './getters';
import canvas from './canvas';
import file from './file';
import customConfig from './customConfig';

Vue.use(Vuex);

const vuexPersistEmitter = () => (store) => {
  store.subscribe((mutation) => {
    if (mutation.type === 'RESTORE_MUTATION') {
      // eslint-disable-next-line no-underscore-dangle
      store._vm.$eventHub.$emit('storageReady');
    }
  });
};

const vuexLocalForage = new VuexPersistence({
  strictMode: process.env.NODE_ENV !== 'production',
  storage: localforage,
  asyncStorage: true,
});

const createStore = () => new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: () => ({
  }),
  mutations: {
    RESTORE_MUTATION: vuexLocalForage.RESTORE_MUTATION,
  },
  modules: {
    canvas,
    file,
    customConfig,
  },
  plugins: [vuexLocalForage.plugin, vuexPersistEmitter()],
});

export default createStore;
