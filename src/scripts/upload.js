import apiPrefix from '~/config';

const uploadUrl = `${apiPrefix}upload/`;

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

async function callFetch(request) {
  const init = {
    method: request.method || 'POST',
    headers: {},
  };

  try {
    const res = await fetch(uploadUrl, init);
    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
}

const remote = {
  uploadPicture,
};

export default remote;
