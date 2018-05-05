import remote from '@/scripts/upload';

const file = {
  state: () => ({
    id: [/* id */],
    parts: {/* [id: id]: parts */},
  }),

  mutations: {
    SET_ID: (state, { data }) => {
      state.id.push(data.id);
    },
    SET_PARTS: (state, { data }) => {
      state.parts[data.id] = data;
    },
  },

  actions: {
    async fetchParts({ commit }, { formData }) {
      const data = await remote.uploadPicture(formData);
      console.log(data);
      commit('SET_ID', { data });
      commit('SET_PARTS', { data });
    },
  },
};

export default file;
