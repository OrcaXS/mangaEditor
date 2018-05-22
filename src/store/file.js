import remote from '@/scripts/fetchFile';
import router from '@/router';

const file = {
  state: () => ({
    id: [/* id */],
    fileData: {/* [id: id]: data */},
    assetsDownloaded: {/* [id: id]: boolean */},
    errInfo: '',
    previewImageEncoded: '',
  }),

  mutations: {
    SET_ID: (state, { data }) => {
      state.id.push(data.info.id);
    },

    SET_FILEDATA: (state, { data }) => {
      const balloonsToObj = data.balloons.reduce((acc, val, idx) => {
        acc[idx] = val;
        return acc;
      }, {});
      console.log(balloonsToObj);
      console.log(data);
      state.fileData[data.info.id] = {};
      // eslint-disable-next-line dot-notation
      state.fileData[data.info.id]['info'] = data.info;
      // eslint-disable-next-line dot-notation
      state.fileData[data.info.id]['balloons'] = balloonsToObj;
      // eslint-disable-next-line dot-notation
      state.fileData[data.info.id]['localImageEncoded'] = state.previewImageEncoded;
      state.previewImageEncoded = '';
    },

    SET_TEMP_IMAGE_URI: (state, { data }) => {
      state.previewImageEncoded = data;
    },

    SET_ASSETS_DOWNLOAD_STATUS: (state, { id, status = false }) => {
      state.assetsDownloaded[id] = status;
    },

    SET_BALLOON_URL_TO_BASE64: (state, { id, blob, balloonNum }) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        console.log(reader.result);
        // eslint-disable-next-line dot-notation
        state.fileData[id].balloons[balloonNum]['filledMaskEncoded'] = reader.result;
      };
    },
  },

  actions: {
    async fetchParts({ commit }, { formData }) {
      const { data } = await remote.uploadPicture(formData);
      if (!data) throw new Error('Cannot fetch data.');
      commit('SET_ID', { data });
      commit('SET_ASSETS_DOWNLOAD_STATUS', { id: data.info.id, status: false });
      commit('SET_FILEDATA', { data });
      router.push({ name: 'canvas', params: { file_id: data.info.id } });
    },

    async fetchFile({ commit, state }, { url, id, balloonNum }) {
      const blob = await remote.downloadPictureFromUrl(url);
      commit('SET_BALLOON_URL_TO_BASE64', { id, blob, balloonNum });
    },

    async setLocalImage({ commit }, { data }) {
      commit('SET_TEMP_IMAGE_URI', { data });
    },
  },
};

export default file;
