import apiPrefix from '../../config';

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

export default uploadPicture;
