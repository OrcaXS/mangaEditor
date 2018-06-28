import Vue from 'vue';

const canvas = {
  state: () => ({
    savedCanvases: [/* id */],
    file: {/* id */},
    zoomLevel: 100,
    currentCursorPosition: {
      x: 0,
      y: 0,
    },
    currentScrollingPosition: {
      dx: 0,
      dy: 0,
    },
    currentlySelected: {
      balloons: [],
      textAreaEditor: null,
      textAreas: [],
    },
  }),

  mutations: {
    SET_ZOOM(state, { type, zoomLevel }) {
      if (type === 'set') state.zoomLevel = zoomLevel;
      if (type === 'increment') state.zoomLevel += zoomLevel;
      if (type === 'decrement' && state.zoomLevel > 1) state.zoomLevel -= zoomLevel;
    },

    SET_CURSOR_POS(state, { cursorCoordinates }) {
      state.currentCursorPosition.x = cursorCoordinates.x;
      state.currentCursorPosition.y = cursorCoordinates.y;
    },

    SET_SELECTION(state, { type, idx }) {
      if (type === 'textAreaEditor') state.currentlySelected.textAreaEditor = idx;
      if (type === 'textAreas') state.currentlySelected.textAreas = [idx];
      if (type === 'balloons') state.currentlySelected.balloons = [idx];
    },

    CLEAR_SELECTION(state, { type }) {
      if (type === 'textAreaEditor') state.currentlySelected.textAreaEditor = null;
      if (type === 'textAreas') state.currentlySelected.textAreas = [];
      if (type === 'balloons') state.currentlySelected.balloons = [];
      if (type === 'clearAll') {
        state.currentlySelected.balloons = [];
        state.currentlySelected.textAreas = [];
        state.currentlySelected.textAreaEditor = null;
      }
    },

    PREPARE_CANVAS(state, { id, balloons, balloonCount }) {
      const flattenedTextAreas = {};
      const flattenedBalloons = {};
      const balloonIdxArr = Array.from(new Array(balloonCount), (x, i) => i);
      let textAreaIdx = 0;
      balloonIdxArr.forEach((balloonIdx) => {
        flattenedBalloons[balloonIdx] = balloons[balloonIdx].boundingRect;
        flattenedBalloons[balloonIdx].visible = true;
        const { textRect } = balloons[balloonIdx];
        Object.values(textRect).forEach((textArea) => {
          flattenedTextAreas[textAreaIdx] = textArea;
          flattenedTextAreas[textAreaIdx].colors = {};
          flattenedTextAreas[textAreaIdx].visible = true;
          textAreaIdx += 1;
        });
      });
      state.file[id] = {};
      Vue.set(state.file[id], 'textAreas', flattenedTextAreas);
      Vue.set(state.file[id], 'balloons', flattenedBalloons);
      Vue.set(state.file[id], 'customTextAreas', {});
    },


    PREPARE_BALLOONS(state, { id, balloons }) {
      const newBalloons = {};
      Object.keys(balloons).forEach((val) => {
        newBalloons[val] = balloons[val].boundingRect;
      });
      Vue.set(state.file[id], 'balloons', newBalloons);
    },

    ADD_CUSTOM_TEXTAREA(state, { id, textarea }) {
      const currentLength = Object.keys(state.file[id].textAreas).length;
      Vue.set(state.file[id].textAreas, currentLength, textarea);
    },

    SET_SCROLLING_POSITION(state, { dx, dy }) {
      state.currentScrollingPosition = { dx, dy };
    },

    SET_TEXTAREA_STYLE(state, {
      id, idx, fontFamily, fontStyle, fontSize, fontWeight,
    }) {
      if (fontFamily) Vue.set(state.file[id].textAreas[idx], 'fontFamily', fontFamily);
      if (fontStyle) Vue.set(state.file[id].textAreas[idx], 'fontStyle', fontStyle);
      if (fontSize) Vue.set(state.file[id].textAreas[idx], 'fontSize', fontSize);
      if (fontWeight) Vue.set(state.file[id].textAreas[idx], 'fontWeight', fontWeight);
    },

    SET_TEXTAREA_CONTENT(state, { id, idx, content }) {
      Vue.set(state.file[id].textAreas[idx], 'textContent', content);
    },

    SET_TEXTAREA_POSITION(state, { id, idx, position }) {
      state.file[id].textAreas[idx].x = position.x;
      state.file[id].textAreas[idx].y = position.y;
    },

    TRANSFORM_TEXTAREA(state, { id, idx, newRect }) {
      state.file[id].textAreas[idx].x = newRect.x;
      state.file[id].textAreas[idx].y = newRect.y;
      state.file[id].textAreas[idx].width = newRect.width;
      state.file[id].textAreas[idx].height = newRect.height;
      Vue.set(state.file[id].textAreas[idx], 'scaleX', newRect.scaleX);
      Vue.set(state.file[id].textAreas[idx], 'scaleY', newRect.scaleY);
    },

    SET_COLOR(state, { id, idx, colors }) {
      state.file[id].textAreas[idx].colors = colors;
    },

    TOGGLE_ELEMENT_VISIBILITY(state, { id, idx, type }) {
      if (type === 'textArea') state.file[id].textAreas[idx].visible = !state.file[id].textAreas[idx].visible;
      if (type === 'balloon') state.file[id].balloons[idx].visible = !state.file[id].balloons[idx].visible;
    },

    DELETE_ELEMENT(state, { id, idx, type }) {
      if (type === 'textArea') Vue.delete(state.file[id].textAreas, idx);
      if (type === 'balloon') Vue.delete(state.file[id].balloons, idx);
    },
  },

  actions: {
    setZoomLevel({ commit }, { zoomLevel }) {
      commit('SET_ZOOM', { type: 'set', zoomLevel });
    },

    modifyZoomLevel({ commit }, { type, zoomLevel }) {
      commit('SET_ZOOM', { type, zoomLevel });
    },

    setCursorPosition({ commit }, { cursorCoordinates }) {
      commit('SET_CURSOR_POS', { cursorCoordinates });
    },

    setScrollingPosition({ commit }, { dx, dy }) {
      commit('SET_SCROLLING_POSITION', { dx, dy });
    },

    setTextAreaStyle({ commit }, {
      id, idx, fontFamily, fontStyle, fontSize, fontWeight,
    }) {
      commit('SET_TEXTAREA_STYLE', {
        id, idx, fontFamily, fontStyle, fontSize, fontWeight,
      });
    },

    setTextAreaContent({ commit }, { id, idx, content }) {
      commit('SET_TEXTAREA_CONTENT', { id, idx, content });
    },

    setTextAreaPosition({ commit }, { id, idx, position }) {
      commit('SET_TEXTAREA_POSITION', { id, idx, position });
    },

    transformTextArea({ commit }, { id, idx, newRect }) {
      commit('TRANSFORM_TEXTAREA', { id, idx, newRect });
    },

    setColor({ commit }, { id, idx, colors }) {
      commit('SET_COLOR', { id, idx, colors });
    },

    setSelection({ commit }, { type, idx }) {
      commit('SET_SELECTION', { type, idx });
    },

    clearSelection({ commit }, { type }) {
      commit('CLEAR_SELECTION', { type });
    },

    toggleElementVisibility({ commit }, { id, idx, type }) {
      commit('TOGGLE_ELEMENT_VISIBILITY', { id, idx, type });
    },

    deleteElement({ commit }, { id, idx, type }) {
      commit('DELETE_ELEMENT', { id, idx, type });
    },

    addCustomTextarea({ commit }, { id, textarea }) {
      commit('ADD_CUSTOM_TEXTAREA', { id, textarea });
    },
  },
};

export default canvas;
