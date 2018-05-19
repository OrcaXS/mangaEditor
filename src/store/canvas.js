const canvas = {
  state: () => ({
    zoomLevel: 1,
    currentCursorPosition: {
      x: 0,
      y: 0,
    },
  }),

  mutations: {
    SET_ZOOM(state, { zoomLevel }) {
      state.zoomLevel = zoomLevel;
    },

    SET_CURSOR_POS(state, { cursorCoordinates }) {
      state.currentCursorPosition.x = cursorCoordinates.x;
      state.currentCursorPosition.y = cursorCoordinates.y;
    },
  },

  actions: {
    setZoomLevel({ commit }, { zoomLevel }) {
      commit('SET_ZOOM', { zoomLevel });
    },

    setCursorPosition({ commit }, { cursorCoordinates }) {
      commit('SET_CURSOR_POS', { cursorCoordinates });
    },
  },
};

export default canvas;
