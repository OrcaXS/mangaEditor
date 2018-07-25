const editor = {
  state: () => ({
    selected: {
      balloon: null,
      textAreaEditor: null,
      textArea: null,
    },
    windowResized: false,
    prepareDownload: false,
  }),

  mutations: {
    WINDOW_RESIZED(state, { status }) {
      state.windowResized = !!status;
    },

    PREPARE_DOWNLOAD(state, { status }) {
      state.prepareDownload = !!status;
    },

    SET_SELECTION(state, { type, idx }) {
      if (type === 'textAreaEditor') state.selected.textAreaEditor = idx;
      if (type === 'textArea') state.selected.textArea = idx;
      if (type === 'balloon') state.selected.balloon = idx;
    },

    CLEAR_SELECTION(state, { type }) {
      if (type === 'textAreaEditor') state.selected.textAreaEditor = null;
      if (type === 'textArea') state.selected.textArea = null;
      if (type === 'balloon') state.selected.balloon = null;
      if (type === 'clearAll') {
        state.selected.balloon = null;
        state.selected.textArea = null;
        state.selected.textAreaEditor = null;
      }
    },
  },

  actions: {
    setSelection({ commit }, { type, idx }) {
      commit('SET_SELECTION', { type, idx });
    },

    clearSelection({ commit }, { type }) {
      commit('CLEAR_SELECTION', { type });
    },

    windowResized({ commit }, { status }) {
      commit('WINDOW_RESIZED', { status });
    },

    prepareDownload({ commit }, { status }) {
      commit('PREPARE_DOWNLOAD', { status });
    },
  },
};

export default editor;
