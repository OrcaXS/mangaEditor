import Vue from 'vue';

const canvas = {
  state: () => ({
    savedCanvases: [/* id */],
    file: {/* id */},
    zoomLevel: 100,
    currentCursorPosition: {
      x: 0,
      y: 0,
    },
  }),

  mutations: {
    SET_ZOOM(state, { type, zoomLevel }) {
      if (type === 'set') state.zoomLevel = zoomLevel;
      if (type === 'increment') state.zoomLevel += zoomLevel;
      if (type === 'decrement' && state.zoomLevel > 1) state.zoomLevel -= zoomLevel;
    },

    SET_CURSOR_POS(state, { cursorCoordinates }) {
      state.currentCursorPosition.x = cursorCoordinates.x;
      state.currentCursorPosition.y = cursorCoordinates.y;
    },

    ADD_TEXTAREA(state, { id, data }) {
      const flattened = {};
      let idx = 0;
      Object.entries(data).forEach(([_key, _val]) => {
        Object.entries(_val).forEach(([__key, __val]) => {
          flattened[idx] = __val;
          idx += 1;
        });
      });
      Vue.set(state.file[id], 'textAreas', flattened);
    },
  },

  actions: {
    setZoomLevel({ commit }, { zoomLevel }) {
      commit('SET_ZOOM', { type: 'set', zoomLevel });
    },

    modifyZoomLevel({ commit }, { type, zoomLevel }) {
      commit('SET_ZOOM', { type, zoomLevel });
    },

    setCursorPosition({ commit }, { cursorCoordinates }) {
      commit('SET_CURSOR_POS', { cursorCoordinates });
    },

    copyTextArea({ commit, rootState }, { id }) {
      commit('ADD_TEXTAREA', { id, data: rootState.file.textAreas[id] });
    },

  },
};

export default canvas;
