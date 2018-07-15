import Vue from 'vue';

const defaultBgColors = {
  hsl: {
    h: 0, s: 0, l: 1, a: 1,
  },
  hex: '#FFFFFF',
  rgba: {
    r: 255, g: 255, b: 255, a: 1,
  },
  hsv: {
    h: 0, s: 0, v: 1, a: 1,
  },
  oldHue: 0,
  source: 'hsva',
  a: 1,
};

const defaultBgColorsTransparent = {
  hsl: {
    h: 0, s: 0, l: 1, a: 0,
  },
  hex: '#FFFFFF',
  rgba: {
    r: 255, g: 255, b: 255, a: 0,
  },
  hsv: {
    h: 0, s: 0, v: 1, a: 0,
  },
  oldHue: 0,
  source: 'hsva',
  a: 0,
};

const defaultFgColors = {
  hsl: {
    h: 0, s: 0, l: 0, a: 1,
  },
  hex: '#000000',
  rgba: {
    r: 0, g: 0, b: 0, a: 1,
  },
  hsv: {
    h: 0, s: 0, v: 0, a: 1,
  },
  oldHue: 0,
  source: 'hsva',
  a: 1,
};

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
      balloon: null,
      textAreaEditor: null,
      textAreas: [],
    },
    windowResized: false,
    prepareDownload: false,
  }),

  getters: {
    getRgbaColors: state => ({ id, idx }) => {
      let fgColor = '';
      let bgColor = '';

      if (state.file[id].textAreas[idx].fgColors.rgba) {
        const fgColorsRgba = state.file[id].textAreas[idx].fgColors.rgba;
        fgColor = `rgba(${fgColorsRgba.r},${fgColorsRgba.g},${fgColorsRgba.b},${fgColorsRgba.a})`;
      } else fgColor = 'rgba(0,0,0,1)';

      if (state.file[id].textAreas[idx].bgColors.rgba) {
        const bgColorsRgba = state.file[id].textAreas[idx].bgColors.rgba;
        bgColor = `rgba(${bgColorsRgba.r},${bgColorsRgba.g},${bgColorsRgba.b},${bgColorsRgba.a})`;
      } else bgColor = 'rgba(255,255,255,0)';

      return { fgColor, bgColor };
    },

    getTextAreas: state => ({ id, type }) => {
      const customTextAreas = {};
      const originalTextAreas = {};
      Object.keys(state.file[id].textAreas).forEach((idx) => {
        if (state.file[id].textAreas[idx].type === 'custom') {
          customTextAreas[idx] = state.file[id].textAreas[idx];
        } else {
          originalTextAreas[idx] = state.file[id].textAreas[idx];
        }
      });
      return type === 'original' ? originalTextAreas : customTextAreas;
    },
  },

  mutations: {
    WINDOW_RESIZED(state, { status }) {
      state.windowResized = !!status;
    },

    PREPARE_DOWNLOAD(state, { status }) {
      state.prepareDownload = !!status;
    },

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
      if (type === 'balloons') state.currentlySelected.balloon = idx;
    },

    CLEAR_SELECTION(state, { type }) {
      if (type === 'textAreaEditor') state.currentlySelected.textAreaEditor = null;
      if (type === 'textAreas') state.currentlySelected.textAreas = [];
      if (type === 'balloons') state.currentlySelected.balloon = [];
      if (type === 'clearAll') {
        state.currentlySelected.balloon = null;
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
        flattenedBalloons[balloonIdx].visible = false;
        const { textRect } = balloons[balloonIdx];
        Object.values(textRect).forEach((textArea) => {
          flattenedTextAreas[textAreaIdx] = textArea;
          flattenedTextAreas[textAreaIdx].type = 'originial';
          flattenedTextAreas[textAreaIdx].balloonIdx = balloonIdx;
          flattenedTextAreas[textAreaIdx].rectCounts = balloons[balloonIdx].textRectCount;
          flattenedTextAreas[textAreaIdx].fgColors = defaultFgColors;
          flattenedTextAreas[textAreaIdx].bgColors = defaultBgColorsTransparent;
          flattenedTextAreas[textAreaIdx].visible = true;
          flattenedTextAreas[textAreaIdx].scaleX = 1;
          flattenedTextAreas[textAreaIdx].scaleY = 1;
          flattenedTextAreas[textAreaIdx].textContent = '';
          flattenedTextAreas[textAreaIdx].textAreaEnabled = false;
          textAreaIdx += 1;
        });
      });
      Vue.set(state.file, id, {});
      Vue.set(state.file[id], 'textAreas', flattenedTextAreas);
      Vue.set(state.file[id], 'balloons', flattenedBalloons);
      Vue.set(state.file[id], 'customTextAreas', {});
      Vue.set(state.file[id], 'textAreaIdx', textAreaIdx);
    },

    ADD_CUSTOM_TEXTAREA(state, { id }) {
      const { textAreaIdx } = state.file[id];
      const newTextArea = {
        type: 'custom',
        balloonIdx: -1,
        bgColors: defaultBgColors,
        fgColors: defaultFgColors,
        visible: true,
        scaleX: 1,
        scaleY: 1,
        x: 500,
        y: 500,
        width: 500,
        height: 500,
        textContent: 'Enter text...',
        textAreaEnabled: true,
      };
      Vue.set(state.file[id].textAreas, textAreaIdx, newTextArea);
      state.file[id].textAreaIdx = textAreaIdx + 1;
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
      state.file[id].textAreas[idx].textContent = content;
      if (!state.file[id].textAreas[idx].textAreaEnabled) {
        state.file[id].textAreas[idx].textAreaEnabled = true;
      }
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
      state.file[id].textAreas[idx].scaleX = newRect.scaleX;
      state.file[id].textAreas[idx].scaleY = newRect.scaleY;
    },

    DRAG_TEXTAREA(state, { id, idx, position }) {
      state.file[id].textAreas[idx].x = position.x;
      state.file[id].textAreas[idx].y = position.y;
    },

    SET_COLOR(state, {
      id, idx, type, colors,
    }) {
      if (type === 'fg') state.file[id].textAreas[idx].fgColors = colors;
      if (type === 'bg') state.file[id].textAreas[idx].bgColors = colors;
    },

    SET_ELEMENT_VISIBILITY(state, {
      id, idx, type, status,
    }) {
      if (type === 'textArea') state.file[id].textAreas[idx].visible = !!status;
      if (type === 'balloon') state.file[id].balloons[idx].visible = !!status;
    },


    TOGGLE_ELEMENT_VISIBILITY(state, { id, idx, type }) {
      if (type === 'textArea') state.file[id].textAreas[idx].visible = !state.file[id].textAreas[idx].visible;
      if (type === 'balloon') state.file[id].balloons[idx].visible = !state.file[id].balloons[idx].visible;
    },

    DELETE_ELEMENT(state, { id, idx, type }) {
      if (type === 'textArea') Vue.delete(state.file[id].textAreas, idx);
      if (type === 'balloon') {
        Vue.delete(state.file[id].balloons, idx);
        Object.keys(state.file[id].textAreas).forEach((textIdx) => {
          if (state.file[id].textAreas[textIdx].balloonIdx.toString() === idx.toString()) {
            Vue.delete(state.file[id].textAreas, textIdx);
          }
        });
      }
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

    transformTextArea({ commit }, { id, idx, newRect }) {
      commit('TRANSFORM_TEXTAREA', { id, idx, newRect });
    },

    dragTextArea({ commit }, { id, idx, position }) {
      commit('DRAG_TEXTAREA', { id, idx, position });
    },

    setColor({ commit }, {
      id, idx, type, colors,
    }) {
      commit('SET_COLOR', {
        id, idx, type, colors,
      });
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

    setElementVisibility({ commit }, {
      id, idx, type, status,
    }) {
      commit('SET_ELEMENT_VISIBILITY', {
        id, idx, type, status,
      });
    },

    deleteElement({ commit }, { id, idx, type }) {
      commit('DELETE_ELEMENT', { id, idx, type });
    },

    addCustomTextArea({ commit }, { id }) {
      commit('ADD_CUSTOM_TEXTAREA', { id });
    },

    windowResized({ commit }, { status }) {
      commit('WINDOW_RESIZED', { status });
    },

    prepareDownload({ commit }, { status }) {
      commit('PREPARE_DOWNLOAD', { status });
    },
  },
};

export default canvas;
