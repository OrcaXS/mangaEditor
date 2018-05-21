import remote from '@/scripts/upload';
import router from '@/router';

const file = {
  state: () => ({
    id: [/* id */],
    localBlob: '',
    fileData: {/* [id: id]: data */},
    errInfo: '',
    localImage: '',
  }),

  mutations: {
    SET_ID: (state, { data }) => {
      state.id.push(data.info.id);
    },
    SET_FILEDATA: (state, { data }) => {
      state.fileData[data.info.id] = data;
    },
    SET_LOCALBLOB: (state, { blobUrl }) => {
      state.localBlob = blobUrl;
    },
    SET_LOCALIMAGE: (state, { data }) => {
      state.localImage = data;
    },
  },

  actions: {
    async fetchParts({ commit }, { formData }) {
      const { data } = await remote.uploadPicture(formData);
      if (!data) throw new Error('Cannot fetch data.');
      commit('SET_ID', { data });
      commit('SET_FILEDATA', { data });
      router.push({ name: 'canvas', params: { file_id: data.info.id } });
    },
    async setLocalBlob({ commit }, { blobUrl }) {
      console.log(blobUrl);
      commit('SET_LOCALBLOB', { blobUrl });
    },
    async setLocalImage({ commit }, { data }) {
      console.log(data);
      commit('SET_LOCALIMAGE', { data });
    },
  },
};

export default file;
