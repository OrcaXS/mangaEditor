import remote from '@/scripts/fetchFile';
import db from '@/scripts/db';
import router from '@/router';

const readFile = (blob) => {
  const tempFileReader = new FileReader();
  return new Promise((resolve, reject) => {
    tempFileReader.onerror = () => {
      tempFileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };
    tempFileReader.onload = () => {
      resolve(tempFileReader.result);
    };
    tempFileReader.readAsDataURL(blob);
  });
};

const file = {
  state: () => ({
    id: [/* id */],
    fileData: {/* [id: id]: data */},
    textAreas: {/* [id: id]: [textAreaNo]: { textAreaObj } */},
    assetsDownloaded: {/* [id: id]: boolean */},
    errInfo: '',
    // previewImageEncoded: '',
    // previewFilename: '',
    status: {
      fileUploaded: false,
      localStorageRdy: false,
      balloonsRdy: false,
    },
  }),

  mutations: {
    SET_ID(state, { data }) {
      state.id.push(data.info.id);
    },

    SET_FILEDATA(state, { data }) {
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
      // state.fileData[data.info.id]['localImageEncoded'] = state.previewImageEncoded;
      // state.previewImageEncoded = '';
    },

    ADD_FILENAME_TO_FILEDATA(state, { filename, id }) {
      state.fileData[id].info.filename = filename;
    },

    ADD_PREVIEW_TO_FILEDATA(state, { id }) {
      // eslint-disable-next-line dot-notation
      // state.fileData[id]['localImageEncoded'] = state.previewImageEncoded;
      // eslint-disable-next-line dot-notation
      state.fileData[id].info.filename = state.previewFilename;
      state.previewImageEncoded = '';
      state.previewFilename = '';
    },

    SET_PREVIEW(state, { dataUri, filename }) {
      state.previewImageEncoded = dataUri;
      state.previewFilename = filename;
    },

    SET_ASSETS_DOWNLOAD_STATUS(state, { id, status = false }) {
      state.assetsDownloaded[id] = status;
    },

    ADD_BALLOON_DATAURI(state, { id, blob, balloonIdx }) {
      // eslint-disable-next-line dot-notation
      // state.fileData[id].balloons[balloonIdx]['filledMaskEncoded'] = blob;
      db.addFileBalloons({ id, blob, balloonIdx });
    },

    SET_STATUS(state, { type, status }) {
      state.status[type] = status;
    },

    CLEAR_STATUS(state) {
      state.status.fileUploaded = false;
      state.status.localStorageRdy = false;
      state.status.balloonsRdy = false;
    },

    SET_TEXTAREA(state, { id, textAreaIdx, textAreaDetail }) {
      state.textAreas[id][textAreaIdx] = textAreaDetail;
    },

    SET_INITIAL_TEXTAREA(state, { id, data }) {
      state.textAreas[id] = {};
      const { balloonCount } = data.info;
      for (let i = 0; i < balloonCount; i += 1) {
        state.textAreas[id][i] = data.balloons[i].textRect;
      }
    },
  },

  actions: {
    async fetchParts({ commit, state }, { formData }) {
      const { data } = await remote.uploadPicture(formData);
      if (!data) throw new Error('Cannot fetch data.');
      // await db.movePreviewToFile({ id: data.info.id });
      commit('SET_STATUS', { type: 'fileUploaded', status: true });
      commit('SET_ID', { data });
      commit('SET_ASSETS_DOWNLOAD_STATUS', { id: data.info.id, status: false });
      commit('SET_FILEDATA', { data });
      // commit('ADD_PREVIEW_TO_FILEDATA', { id: data.info.id });
      commit('SET_INITIAL_TEXTAREA', { id: data.info.id, data });
      commit('ADD_TEXTAREA_FLATTENED', { id: data.info.id, data: state.textAreas[data.info.id] });
      commit('SET_STATUS', { type: 'localStorageRdy', status: true });
    },


    // setPreview({ commit }, { dataUri, filename }) {
    //   commit('SET_PREVIEW', { dataUri, filename });
    // },

    clearStatus({ commit }) {
      commit('CLEAR_STATUS');
    },

    addTextArea({ commit }, { id, textAreaIdx, textAreaDetail }) {
      commit('SET_TEXTAREA', { id, textAreaIdx, textAreaDetail });
    },

  },
};

export default file;
