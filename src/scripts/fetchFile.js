import apiPrefix from '~/config';

const uploadUrl = `${apiPrefix}upload/v2/`;

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

async function downloadPictureFromUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
    });
    return await res.blob();
  } catch (error) {
    throw error;
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
};

export default remote;
