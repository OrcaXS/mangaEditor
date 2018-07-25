import localforage from 'localforage';

async function initFiles() {
  try {
    const files = await localforage.getItem('files');
    if (!files) await localforage.setItem('files', {});
  } catch (e) {
    throw new Error(e);
  }
}

async function getPreview() {
  try {
    const val = await localforage.getItem('currentPreview');
    return val;
  } catch (e) {
    throw new Error(e);
  }
}

async function setPreview({ data }) {
  try {
    await localforage.setItem('currentPreview', data);
  } catch (e) {
    throw new Error(e);
  }
}

async function movePreviewToFile({ id }) {
  try {
    const files = await localforage.getItem('files');
    // console.log(files);
    const preview = await localforage.getItem('currentPreview');
    if (!files[id]) files[id] = {};
    // eslint-disable-next-line dot-notation
    files[id]['bgImage'] = preview;
    await localforage.setItem('files', files);
  } catch (e) {
    throw new Error(e);
  }
}

// async function addFileBg({ id, image }) {
//   try {
//     await localforage.setItem('files', { [id]: { bgImage: image } });
//   } catch (e) {
//     throw new Error(e);
//   }
// }


// async function getBalloons({ id }) {
//   try {
//     const balloons = await localforage.getItem('files')[id].balloons;
//     return balloons;
//   } catch (e) {
//     throw new Error(e);
//   }
// }

async function getAllFiles() {
  try {
    const files = await localforage.getItem('files');
    return files;
  } catch (e) {
    throw new Error(e);
  }
}

async function getFile({ id }) {
  try {
    const files = await localforage.getItem('files');
    return files[id];
  } catch (e) {
    throw new Error(e);
  }
}

async function getBalloons({ id }) {
  try {
    const files = await localforage.getItem('files');
    return files[id].balloons;
  } catch (e) {
    throw new Error(e);
  }
}

async function deleteFile({ id }) {
  try {
    const files = await localforage.getItem('files');
    delete files[id];
    await localforage.setItem('files', files);
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

async function addMultiBalloons({ id, balloons }) {
  try {
    await localforage.setItem('files', { [id]: { balloons } });
  } catch (e) {
    throw new Error(e);
  }
}

async function addBalloonBlobsToFile({ id, blobs }) {
  try {
    const files = await localforage.getItem('files');
    // let currentBalloons = files[id].balloons ? files[id].balloons : {};
    // currentBalloons = blobs;
    // eslint-disable-next-line dot-notation
    files[id]['balloons'] = blobs;
    await localforage.setItem('files', files);
  } catch (e) {
    throw new Error(e);
  }
}

const db = {
  initFiles,
  setPreview,
  getPreview,
  movePreviewToFile,
  addBalloonBlobsToFile,
  // addFileBg,
  getFile,
  getAllFiles,
  getBalloons,
  deleteFile,
};

export default db;
