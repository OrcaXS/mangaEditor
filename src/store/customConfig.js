import Vue from 'vue';

const customConfig = {
  state: () => ({
    customFonts: [],
  }),

  mutations: {
    ADD_FONT_FAMILY(state, { name }) {
      state.customFonts.push(name);
    },
  },

  actions: {
    addFontFamily({ commit }, { name }) {
      commit('ADD_FONT_FAMILY', { name });
    },
  },
};

export default customConfig;
