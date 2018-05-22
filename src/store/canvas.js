const canvas = {
  state: () => ({
    zoomLevel: 100,
    currentCursorPosition: {
      x: 0,
      y: 0,
    },
    textAreas: [/* [textAreaNo]: { textAreaObj } */],
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

    SET_TEXTAREA(state, { textAreaDetail }) {
      state.textAreas.push(textAreaDetail);
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

    addTextArea({ commit }, { textAreaDetail }) {
      commit('SET_TEXTAREA', { textAreaDetail });
    },
  },
};

export default canvas;
