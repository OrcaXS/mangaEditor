import Vue from 'vue';

const customConfig = {
  state: () => ({
    customFonts: [],
  }),

  mutations: {
    ADD_FONT_FAMILY(state, { name }) {
      state.customFonts.push(name);
    },
    REMOVE_FONT_FAMILY(state, { idx }) {
      state.customFonts.splice(idx, 1);
    },
  },

  actions: {
    addFontFamily({ commit }, { name }) {
      commit('ADD_FONT_FAMILY', { name });
    },
    removeFontFamily({ commit }, { idx }) {
      commit('REMOVE_FONT_FAMILY', { idx });
    },
  },
};

export default customConfig;
