import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faThList,
  faTags,
  faQuestionCircle,
  faInfo,
  faArrowRight,
  faLanguage,
  faBars,
  faTimes,
  faSearch,
  faAngleDown,
  faPlay,
  faPlayCircle,
  faPause,
  faPauseCircle,
  faCircleNotch,
  faChevronRight,
  faChevronLeft,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faStopwatch,
  faFilter,
  faTerminal,
  faUndo,
  faRedo,
  faSave,
  faPlusSquare,
  faSearchMinus,
  faSearchPlus,
  faCrop,
  faTrash,
  faEye,
  faEyeSlash,
  faPlus,
  faArrowLeft,
  faCog,
  faHome,
  faCaretRight,
  faCaretDown,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import {
  faSquare,
  faCircle,
  faImage,
  faEdit,
} from '@fortawesome/free-regular-svg-icons';

// fontawesome.config = {
//   autoAddCss: false,
// };

export default function loadFA() {
  // eslint-disable-next-line max-len
  library.add(faThList, faTags, faQuestionCircle, faInfo, faArrowRight, faLanguage, faBars, faTimes, faSearch, faAngleDown, faPlay, faPlayCircle, faPause, faPauseCircle, faCircleNotch, faChevronRight, faChevronLeft, faLongArrowAltRight, faLongArrowAltLeft, faStopwatch, faFilter, faTerminal, faUndo, faRedo, faSave, faSquare, faPlusSquare, faSearchMinus, faSearchPlus, faCircle, faImage, faEdit, faCrop, faTrash, faEye, faEyeSlash, faPlus, faArrowLeft, faCog, faHome, faCaretRight, faCaretDown, faSpinner);
}
