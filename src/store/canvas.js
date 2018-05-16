const canvas = {
  state: () => ({
    zoomLevel: 1,
  }),

  mutations: {
    SET_ZOOM(state, { zoomLevel }) {
      state.zoomLevel = zoomLevel;
    },
  },

  actions: {
    setZoomLevel({ commit }, { zoomLevel }) {
      commit('SET_ZOOM', { zoomLevel });
    },
  },
};

export default canvas;
