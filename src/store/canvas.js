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
    currentScrollingPosition: {
      dx: 0,
      dy: 0,
    },
    currentTextArea: null,
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

    SET_TEXTAREA_IDX(state, { idx }) {
      state.currentTextArea = idx;
    },

    ADD_TEXTAREA_FLATTENED(state, { id, data }) {
      const flattened = {};
      let idx = 0;
      Object.values(data).forEach((val) => {
        Object.values(val).forEach((textArea) => {
          flattened[idx] = textArea;
          idx += 1;
        });
      });
      state.file[id] = {};
      // eslint-disable-next-line dot-notation
      state.file[id]['textAreas'] = flattened;
      // Vue.set(state.file[id], 'textAreas', flattened);
    },

    ADD_TEXTAREA(state, { id, data }) {
      // const flattened = {};
      // let idx = 0;
      // Object.entries(data).forEach(([_key, _val]) => {
      //   Object.entries(_val).forEach(([__key, __val]) => {
      //     flattened[idx] = __val;
      //     idx += 1;
      //   });
      // });
      state.file[id] = {};
      // eslint-disable-next-line dot-notation
      state.file[id]['textAreas'] = data;
      // Vue.set(state.file[id], 'textAreas', flattened);
    },

    SET_SCROLLING_POSITION(state, { dx, dy }) {
      state.currentScrollingPosition = { dx, dy };
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

    // copyTextArea({ commit, rootState }, { id }) {
    //   commit('ADD_TEXTAREA', { id, data: rootState.file.textAreas[id] });
    // },

    setTextAreaIdx({ commit }, { idx }) {
      commit('SET_TEXTAREA_IDX', { idx });
    },

    setScrollingPosition({ commit }, { dx, dy }) {
      commit('SET_SCROLLING_POSITION', { dx, dy });
    },
  },
};

export default canvas;
