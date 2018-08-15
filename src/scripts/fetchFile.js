import db from './db';

const uploadUrl = `${process.env.VUE_APP_API_PREFIX}upload/v2/`;

async function uploadPicture(formData) {
  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
}

async function downloadPictureFromUrl(url, idx) {
  try {
    const res = await fetch(url, {
      method: 'GET',
    });
    const blob = await res.blob();
    return blob;
  } catch (error) {
    throw error;
  }
}

async function parallelFetchToDb({ id, balloonUrls, balloonCount }) {
  const blobs = {}; // TODO
  const urlProms = {};
  const balloonBlobs = {};
  try {
    for (let i = 0; i < balloonCount; i += 1) {
      console.log(balloonUrls[i]);
      urlProms[i] = downloadPictureFromUrl(balloonUrls[i], i);
    }
    console.log(urlProms);
    // return await urlProm;
    for (let i = 0; i < balloonCount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await urlProms[i];
      // console.log(blob);
      // console.log(i);
      if (!(blob instanceof Blob)) throw new Error('Not blob');
      // eslint-disable-next-line no-await-in-loop
      balloonBlobs[i] = blob;
    }
    await db.addBalloonBlobsToFile({ id, blobs: balloonBlobs });
    console.log(balloonBlobs);
  } catch (e) {
    throw e;
  }
}

async function callFetch(request) {
  const init = {
    method: request.method || 'GET',
    headers: {},
  };

  try {
    const res = await fetch(uploadUrl, init);
    const blob = await res.blob();
    return blob;
  } catch (error) {
    throw error;
  }
}

const remote = {
  uploadPicture,
  downloadPictureFromUrl,
  parallelFetchToDb,
};

export default remote;
