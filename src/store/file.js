import Vue from 'vue';
import remote from '@/scripts/fetchFile';

const file = {
  state: () => ({
    lastId: null,
    fileData: {/* [id: id]: data */},
    errInfo: '',
    status: {
      fileUploaded: false,
      localStorageRdy: false,
      balloonsRdy: false,
    },
  }),

  mutations: {
    SET_LASTID(state, { id }) {
      state.lastId = id;
    },

    SET_FILEDATA(state, { data }) {
      const balloonsToObj = data.balloons.reduce((acc, val, idx) => {
        acc[idx] = val;
        return acc;
      }, {});
      Vue.set(state.fileData, data.info.id, {});
      Vue.set(state.fileData[data.info.id], 'info', data.info);
      Vue.set(state.fileData[data.info.id], 'balloons', balloonsToObj);
    },

    SET_ASSETS_DOWNLOAD_STATUS(state, { id, status = false }) {
      Vue.set(state.assetsDownloaded, id, status);
    },

    SET_STATUS(state, { type, status }) {
      if (type === 'fileUploaded') state.status.fileUploaded = !!status;
      if (type === 'localStorageRdy') state.status.localStorageRdy = !!status;
      if (type === 'balloonsRdy') state.status.balloonsRdy = !!status;
    },

    CLEAR_STATUS(state) {
      state.status.fileUploaded = false;
      state.status.localStorageRdy = false;
      state.status.balloonsRdy = false;
    },

  },

  actions: {
    async fetchParts({ commit }, { formData }) {
      const { data } = await remote.uploadPicture(formData);
      if (!data) throw new Error('Cannot fetch data.');
      // await db.movePreviewToFile({ id: data.info.id });
      commit('SET_STATUS', { type: 'fileUploaded', status: true });
      commit('SET_LASTID', { id: data.info.id });
      commit('SET_FILEDATA', { data });
      commit('PREPARE_CANVAS', { id: data.info.id, balloons: data.balloons, balloonCount: data.info.balloonCount });
      commit('SET_STATUS', { type: 'localStorageRdy', status: true });
    },

    clearStatus({ commit }) {
      commit('CLEAR_STATUS');
    },

    resetCanvas({ commit, state }, { id }) {
      commit('PREPARE_CANVAS', { id, balloons: state.fileData[id].balloons, balloonCount: state.fileData[id].info.balloonCount });
    },

  },
};

export default file;
