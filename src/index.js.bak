import loadFA from './scripts/fontawesome';
import uploadPicture from './scripts/upload';
import updateImageDisplay from './scripts/inputFile';

const initialPicInput = document.querySelector('#image_uploads');
const uploadForm = document.querySelector('#uploadForm');
const formData = new FormData(uploadForm);

loadFA();

initialPicInput.style.opacity = 0;
initialPicInput.addEventListener('change', updateImageDisplay);
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  uploadPicture(formData);
});
