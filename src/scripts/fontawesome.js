import fontawesome from '@fortawesome/fontawesome';
import { faUpload } from '@fortawesome/fontawesome-free-solid';
// import faCircle from '@fortawesome/fontawesome-free-regular/faCircle';
// import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';

function loadFA() {
  fontawesome.library.add(faUpload);
}

export default loadFA;
