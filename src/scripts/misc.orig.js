const screenWidth = $(window).width();
const screenHeight = $(window).height();
let SCALE_FACTOR = 1.2;
let canvasScale = 1;


function SBC2DBC(str) {
  let result = '';
  for (i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (code >= 33 && code <= 125) {
			   result += String.fromCharCode(str.charCodeAt(i) + 65248);
	  } else if (code == 32) {
	   result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32);
	  } else {
	   result += str.charAt(i);
	  }
	 }
	 return result;
}


$.fn.getPreText = function () {
  const ce = $('<pre />').html(this.html());
  if (bowser.webkit) { ce.find('div').replaceWith(function () { return `\n${this.innerHTML}` }) }
  if (bowser.msie) { ce.find('p').replaceWith(function () { return `${this.innerHTML}<br>` }) }
  if (bowser.mozilla || bowser.opera || bowser.msie) { ce.find('br').replaceWith('\n') }
  if (ce.text() == '') { return '\u3000' }
  return ce.text();
};

// TODO: generate a grid-system, storing all coordinates inside an array.
// var canvas = new fabric.Canvas('generatedMedia');
let fontSizeCache = [];

function measureTextHeight(text, fontSize, fontFamily) {
  // create a temp canvas
  const width = fontSize * 1.5;
  const height = fontSize * 1.5;
  const cvs = document.createElement('canvas');
  cvs.width = width;
  cvs.height = height;
  const ctx = cvs.getContext('2d');

  fontSizeFace = `${fontSize}px ${fontFamily}`;
  let charWidth;
  let charHeight;
  let charTop;
  let charLeft;

  // Draw the entire a-z/A-Z alphabet in the canvas
  ctx.font = fontSizeFace;
  ctx.clearRect(0, 0, width, height);
  ctx.fillText(text, 1, fontSize);
  // ctx.restore();

  // Get the pixel data from the canvas
  let data = ctx.getImageData(0, 0, width, height).data,
    first = false,
    last = false,
    r = height,
    c = 0;
  /* for(x=0;x<height;x++)
	{
		e = "";
		for(y=0;y<width;y++)
		{
			w = data[(x*width+y)*4+3];
			if(w)
				e = e+w/w;
			else
				e = e + "0";
		}
		console.log(e);
	} */

  // Find the last line with a non-transparent pixel
  for (x = 0; x < height; x++) {
    var stopFlag = false;
    for (y = 0; y < width; y++) {
      w = data[(x * width + y) * 4 + 3];
      if (w) {
        first = x;
        stopFlag = true;
        break;
      }
    }
    if (stopFlag) { break }
  }
  if (first) {
    var stopFlag = false;
    for (x = height - 1; x >= 0; x--) {
      for (y = 0; y < width; y++) {
        w = data[(x * width + y) * 4 + 3];
        if (w) {
          last = x;
          stopFlag = true;
          break;
        }
      }
      if (stopFlag) { break }
    }
    charHeight = last - first;
  } else {
    charHeight = fontSize;
  }
  charTop = first;


  first = false,
  last = false;
  for (y = 0; y < width; y++) {
    var stopFlag = false;
    for (x = 0; x < height; x++) {
      w = data[(x * width + y) * 4 + 3];
      if (w) {
        first = y;
        stopFlag = true;
        break;
      }
    }
    if (stopFlag) { break }
  }
  if (first) {
    for (y = width - 1; y >= 0; y--) {
      var stopFlag = false;
      for (x = 0; x < height; x++) {
        w = data[(x * width + y) * 4 + 3];
        if (w) {
          last = y;
          stopFlag = true;
          break;
        }
      }
      if (stopFlag) { break }
    }
    charWidth = last - first;
  } else {
    charWidth = fontSize;
  }
  charLeft = first;
  const result = Array();
  result.width = charWidth;
  result.height = charHeight;
  result.left = charLeft;
  result.top = charTop;
  // alert(0);
  return result;
}

function getRealCharDimension(t, fontSize, fontFamily, f) {
  let tDim;
  if (typeof fontSizeCache[t] === 'undefined' || f == true) {
	   // does not exist
	   tDim = measureTextHeight(t, fontSize, fontFamily);
	   fontSizeCache[t] = tDim;
  } else {
    // does exist
    tDim = fontSizeCache[t];
  }
  return tDim;
}


let generatedRects;
let textareaLUT;
let textareaLUTSize;
let additionalTextareaLUT;

const rects = [];
const balloonMasks = Array();
let globalCanvas;

let activeBalloon;
let activeRect;

let editMode = false;
const verticalMode = true;
let perTextAreaVerticalMode;

let globalFont = '';
let globalFontSize = 20;


function generateGridSystem(canvas, text, width, height, fontSize, fontFamily, fontWeight, type, top, left, textareaId, rectId) {
  console.log(type);

  if (type == true) {
    // feel sorry that Math.trunc() is in ECMAScript 6.
    const rows = Math.floor((height + 1) / fontSize);
    const coordinates = Array();
    let cursorPos = 0;
    const grid = [];
    // temporarily solve the half-size character problem.
    text = SBC2DBC(text);

    // instantly compute the cols.
    let cols = 0;
    for (var i = 0; i < text.length; i++) {
      const dim = [];
      t = text[i];
      if (t != '\n') {
        if (i === text.length - 1) {
          dim.x = cursorPos;
          dim.y = cols;
        } else { // check next char.
          if (cursorPos % rows === rows - 1) {
            if ((text[i + 1].charCodeAt(0) > 65280 && text[i + 1].charCodeAt(0) < 65324) || (text[i + 1].charCodeAt(0) > 12288 && text[i + 1].charCodeAt(0) < 12291)) {
              // force line break on symbols;
              cols += 1;
              cursorPos = 0;
              dim.x = cursorPos;
              dim.y = cols;
              cursorPos += 1;
            } else if (text[i + 1] != '\n') {
              dim.x = cursorPos;
              dim.y = cols;
              cols += 1;
              cursorPos = 0;
            } else {
              dim.x = cursorPos;
              dim.y = cols;
              cursorPos += 1;
            }
          } else {
            // common state
            dim.x = cursorPos;
            dim.y = cols;
            cursorPos += 1;
          }
        }
      } else {
        cols += 1;
        cursorPos = 0;
        dim.x = cursorPos;
        dim.y = cols;
      }
      grid.push(dim);
    }

    const colWidth = fontSize * 1.20;

    const texts = Array();
    for (i = 0; i < text.length; i++) {
      const cursorCol = cols - grid[i].y - 1;
      cursorPos = grid[i].x;

      t = text[i];
      // escape can be dealt later.
      // compute stroke position and width;

      let tDim = getRealCharDimension(t, fontSize + fontSize % 2, fontFamily);

      const charWidth = tDim.width;
      const charHeight = tDim.height;
      const charLeft = tDim.left;
      const charTop = tDim.top;
      var charAngle = 0;
      const leftMargin = width - cols * colWidth + (colWidth - fontSize);


      // render special chars
      let specialChar = false;
      let verticalMargin = 0;
      switch (t) {
        case '\n':
        {
          continue;
        }
        case '\u3001':
        {
          // [ ã€]
          specialChar = true;
          verticalMargin = -charTop + (fontSize - charHeight) / 2 + 2;
          break;
        }
        case '\u3002':
        {
          // [ ã€‚]

          specialChar = true;
          verticalMargin = -charTop + (fontSize - charHeight) / 2 + 2;
          // console.log(fontSize,verticalMargin,charHeight,charWidth,charTop,charLeft);
          break;
        }
        case '\uff0c':
        {
          // [ ï¼Œ]
          specialChar = true;
          verticalMargin = -charTop + (fontSize - charHeight) / 2 + 2;
          break;
        }
        case '\uff01':
        {
          // [ ï¼]
          specialChar = true;
          break;
        }
        case '\u2026':
        {
          // [ â€¦ ]
          t = '\ufe19';
          tDim = getRealCharDimension(t, fontSize, fontFamily);
          break;
        }
        case '\u201c':
        {
          // [ â€œ ]
          t = '\ufe43';
          tDim = getRealCharDimension(t, fontSize, fontFamily);
          break;
        }
        case '\u201d':
        {
          // [ â€œ ]
          t = '\ufe44';
          tDim = getRealCharDimension(t, fontSize, fontFamily);
          break;
        }
        case '\u2014':
        {
          // [ - ]
          charAngle = 90;
          break;
        }
        case '\uff5e':
        {
          // [ ï½ž ]
          charAngle = 90;
          break;
        }
        case '\u007e':
        {
          // [ ~ ]
          charAngle = 90;
          break;
        }
        case '\uff08':
        {
          // [ ( ]
          charAngle = 90;
          break;
        }
        case '\uff09':
        {
          // [ ) ]
          charAngle = 90;
          break;
        }
        case '\uff5b':
        {
          // [ { ]
          charAngle = 90;
          break;
        }
        case '\uff5d':
        {
          // [ } ]
          charAngle = 90;
          break;
        }
        case '\u3010':
        {
          // [ ã€ ]
          charAngle = 90;
          break;
        }
        case '\u3011':
        {
          // [ ã€‘ ]
          charAngle = 90;
          break;
        }
        case '\u300a':
        {
          // [ ã€Š ]
          charAngle = 90;
          break;
        }
        case '\u300b':
        {
          // [ ã€‹ ]
          charAngle = 90;
          break;
        }
      }
      const topOffset = (cursorPos - 1) * fontSize + verticalMargin;
      var leftOffset;
      if (specialChar) { leftOffset = leftMargin + (cursorCol) * colWidth + (fontSize - charWidth) / 2 - charLeft + 3 } else { leftOffset = leftMargin + (cursorCol) * colWidth }

      var newText = new fabric.Text(t, {
        left: leftOffset, top: topOffset, fontFamily, fontSize, fontWeight, angle: charAngle, originX: 'center', originY: 'center',
      });
      texts.push(newText);
    }

    var newText = new fabric.Text('\u3000', {
      left: 0, top: fontSize, fontFamily, fontSize, angle: charAngle, originX: 'center', originY: 'center',
    });
    texts.push(newText);
    newText = new fabric.Text('\u3000', {
      left: 0, bottom: fontSize, fontFamily, fontSize, angle: charAngle, originX: 'center', originY: 'center',
    });
    texts.push(newText);
    newText = new fabric.Text('\u3000', {
      left: width - fontSize, bottom: fontSize, fontFamily, fontSize, angle: charAngle, originX: 'center', originY: 'center',
    });
    texts.push(newText);
    newText = new fabric.Text('\u3000', {
      left: width - fontSize, bottom: fontSize, fontFamily, fontSize, angle: charAngle, originX: 'center', originY: 'center',
    });
    texts.push(newText);
    var groups = new fabric.Group(texts, {
		  left,
		  top,
    });

    groups.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });

    if (typeof (textareaLUT[textareaId][rectId]) !== undefined) { canvas.remove(textareaLUT[textareaId][rectId]) }
    textareaLUT[textareaId][rectId] = groups;
    // groups.set({lockScalingY : true});
    canvas.add(groups);
    canvas.setActiveObject(groups);
  } else {
    // console.log("here!");
    var groups = new fabric.Textbox(text, {
		  left,
		  top,
		  width,
		  height,
		  fontFamily,
		  fontSize,
		  fontWeight,
    });

    if (typeof (textareaLUT[textareaId][rectId]) !== undefined) { canvas.remove(textareaLUT[textareaId][rectId]) }
    textareaLUT[textareaId][rectId] = groups;
    // groups.set({lockScalingY : true});
    canvas.add(groups);
    canvas.setActiveObject(groups);
  }
}

function enableCanvasObjectDblclickInteraction(canvas, textareaId, rectId) {
  textareaLUT[textareaId][rectId].on('object:click', () => {
    const i = textareaId;
    const j = rectId;
    if (i < fileDetails.balloonCount) {
      $('img.listItemImage').attr('src', fileDetails[i].originalURL);
      $('#testTranslation').removeClass('disabled');
    } else {
      $('#testTranslation').addClass('disabled');
    }
  });


  textareaLUT[textareaId][rectId].on('object:dblclick', function () {
    editMode = true;

    $('.darkroom-icon-cancel').parent().removeClass('disabled');
    $('.darkroom-icon-rotate-left').parent().removeClass('disabled');
    $('.canvasQuickEditor').css('display', 'inline-block');

    const i = textareaId;
    const j = rectId;
    activeBalloon = i;
    activeRect = j;

    if (i < fileDetails.balloonCount) {
      $('img.listItemImage').attr('src', fileDetails[i].originalURL);
      $('#testTranslation').removeClass('disabled');
      $('#originalText').val('');
      $('#translatedText').val('');
    } else {
      $('#testTranslation').addClass('disabled');
    }

    const waTop = this.top + 50 + 52;
    const waLeft = this.left + 30;
    const waWidth = this.width;
    const waHeight = this.height;

    $(`.balloon${i}.rect${j}`).css({
      top: waTop,
      left: waLeft,
      width: waWidth,
      height: waHeight,
      opacity: 0.9,
      'box-shadow': '0px 0px 2px 1px #66ccff',
		 });

		 $('#canvasQuickEditor').css({
      top: waTop,
      left: waLeft + waWidth + 10,
    });


    $(`.balloon${i}.rect${j}`).show();
    $(`.balloon${i}.rect${j}`).focus();
    $(document).on('click', (evt) => {
      const $tgt = $(evt.target);
      if (!$tgt.is('li,select,option') && !$tgt.is(`.balloon${i}.rect${j}`) && !$tgt.is('.writingArea div')) {
        editMode = false;
        renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j);
        $(document).off('click');
      }
    });
    canvas.remove(this);
  });
}


function onObjectSelected(canvas, e, balloonCount) {
  const scaledObject = e.target;
  let selected = false;
  // find proper textareaID and textrectId

  for (var i = 0; i < fileDetails.balloonCount; i++) {
    // check if balloon masks was selected
    if (scaledObject == balloonMasks[i] && textareaLUT[i][0] === undefined) {
      console.log('clicked');
      activeBalloon = i;
      $('#originalText').val('');
      $('#translatedText').val('');
      $('img.listItemImage').attr('src', fileDetails[i].originalURL);
      $('#testTranslation').removeClass('disabled');
      return;
    }

    $('#testTranslation').addClass('disabled');
  }

  for (var i = 0; i < balloonCount + 1; i++) {
    for (var j = 0; j < 10; j++) {
      if (scaledObject == textareaLUT[i][j]) {
        textareaId = i;
        rectId = j;
        selected = true;
      }
    }
  }
  if (selected) {
    var i = textareaId;
    var j = rectId;
    activeBalloon = i;
    activeRect = j;
    if (i < fileDetails.balloonCount) {
      $('img.listItemImage').attr('src', fileDetails[i].originalURL);
      $('#testTranslation').removeClass('disabled');
      $('#originalText').val('');
      $('#translatedText').val('');
    } else {
      $('#testTranslation').addClass('disabled');
    }

    const waTop = scaledObject.getTop() + 50;
    const waLeft = scaledObject.getLeft();
    const waWidth = scaledObject.getWidth();
    const waHeight = scaledObject.getHeight();

    $('#canvasQuickEditor').css({
      top: waTop,
      left: waLeft + waWidth + 10,
    });
    $(`.balloon${i}.rect${j}`).css({
      top: waTop,
      left: waLeft,
    });

    $('#canvasQuickEditor').css({
      top: waTop,
      left: waLeft + waWidth + 10,
    });
    $('#canvasQuickEditor').show();
  }
}

function onObjectScaled(canvas, e, balloonCount) {
  const scaledObject = e.target;
  let selected = false;
  // find proper textareaID and textrectId

  for (var i = 0; i < balloonCount + 1; i++) {
    for (var j = 0; j < 20; j++) {
      if (scaledObject == textareaLUT[i][j]) {
        textareaId = i;
        rectId = j;
        selected = true;
        console.log(i, j);
      }
    }
  }

  var i = textareaId;
  var j = rectId;
  activeBalloon = i;
  activeRect = j;

  $('#originalText').val('');
  $('#translatedText').val('');

  const textarea = $(`.balloon${textareaId}.rect${rectId}`);
  const text = textarea.getPreText();
  const fontSize = parseInt(textarea.css('font-size').slice(0, -2), 10);

  const waTop = scaledObject.getTop() + 50;
  const waLeft = scaledObject.getLeft();
  const waWidth = scaledObject.getWidth();
  const waHeight = scaledObject.getHeight();

  $('#canvasQuickEditor').css({
    top: waTop,
    left: waLeft + waWidth + 10,
  });
  $(`.balloon${i}.rect${j}`).css({
    top: waTop,
    left: waLeft,
    width: waWidth,
    height: waHeight,
  });

  generateGridSystem(canvas, text, scaledObject.getWidth(), scaledObject.getHeight(), fontSize, textarea.css('font-family'), textarea.css('font-weight'), perTextAreaVerticalMode[i][j], scaledObject.getTop(), scaledObject.getLeft(), textareaId, rectId);
  enableCanvasObjectDblclickInteraction(canvas, textareaId, rectId);
}


function renderContent(canvas, textarea, textareaId, rectId, rotation) {
  // clear existing instance

  const width = parseInt(textarea.css('width').slice(0, -2), 10);
  const height = parseInt(textarea.css('height').slice(0, -2), 10);
  let left = parseInt(textarea.css('left').slice(0, -2), 10);
  let top = parseInt(textarea.css('top').slice(0, -2), 10);

  console.log(width, height);

  const fontSize = parseInt(textarea.css('font-size').slice(0, -2), 10);

  // fix fabric alignment
  if (rotation != true) {
    left -= 30;
    top -= 102;
  } else {
    top -= 53;
    left = left;
  }

  const i = textareaId;
  const j = rectId;


  const text = textarea.getPreText();
  generateGridSystem(canvas, text, width, height, fontSize, textarea.css('font-family'), textarea.css('font-weight'), perTextAreaVerticalMode[i][j], top, left, textareaId, rectId);

  enableCanvasObjectDblclickInteraction(canvas, textareaId, rectId);

  $(textarea).hide();
}

// Interface routines

let fileDetails;
let firstStageCanvas;
let originalImage;


function zoomIn(canvas) {
  // TODO limit the max canvas zoom in

  canvasScale *= SCALE_FACTOR;

  canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
  canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);

  const objects = canvas.getObjects();
  for (const i in objects) {
    const scaleX = objects[i].scaleX;
    const scaleY = objects[i].scaleY;
    const left = objects[i].left;
    const top = objects[i].top;

    const tempScaleX = scaleX * SCALE_FACTOR;
    const tempScaleY = scaleY * SCALE_FACTOR;
    const tempLeft = left * SCALE_FACTOR;
    const tempTop = top * SCALE_FACTOR;

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }

  canvas.renderAll();
}

// Zoom Out
function zoomOut(canvas) {
  // TODO limit max cavas zoom out

  canvasScale /= SCALE_FACTOR;

  canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
  canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

  const objects = canvas.getObjects();
  for (const i in objects) {
    const scaleX = objects[i].scaleX;
    const scaleY = objects[i].scaleY;
    const left = objects[i].left;
    const top = objects[i].top;

    const tempScaleX = scaleX * (1 / SCALE_FACTOR);
    const tempScaleY = scaleY * (1 / SCALE_FACTOR);
    const tempLeft = left * (1 / SCALE_FACTOR);
    const tempTop = top * (1 / SCALE_FACTOR);

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }

  canvas.renderAll();
}

function zoomTo(canvas, scale) {
  // TODO limit max cavas zoom out

  SCALE_FACTOR = scale / canvasScale;
  canvasScale = scale;

  canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
  canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

  const objects = canvas.getObjects();
  // console.log(objects);
  for (const i in objects) {
    const scaleX = objects[i].scaleX;
    const scaleY = objects[i].scaleY;
    const left = objects[i].left;
    const top = objects[i].top;

    const tempScaleX = scaleX * (1 / SCALE_FACTOR);
    const tempScaleY = scaleY * (1 / SCALE_FACTOR);
    const tempLeft = left * (1 / SCALE_FACTOR);
    const tempTop = top * (1 / SCALE_FACTOR);

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }

  canvas.renderAll();
  SCALE_FACTOR = 1.2;
}

// Reset Zoom
function resetZoom(canvas) {
  canvas.setHeight(canvas.getHeight() * (1 / canvasScale));
  canvas.setWidth(canvas.getWidth() * (1 / canvasScale));

  const objects = canvas.getObjects();
  for (const i in objects) {
    const scaleX = objects[i].scaleX;
    const scaleY = objects[i].scaleY;
    const left = objects[i].left;
    const top = objects[i].top;

    const tempScaleX = scaleX * (1 / canvasScale);
    const tempScaleY = scaleY * (1 / canvasScale);
    const tempLeft = left * (1 / canvasScale);
    const tempTop = top * (1 / canvasScale);

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }

  canvas.renderAll();

  canvasScale = 1;
}

function addBalloonMasks(canvas, data, i, computedScale) {
  console.log(i);
  if (i == data.balloonCount) {
    $('div.actions ul').click(function () { $(this).parent().css('opacity', '0') });
  } else {
    fabric.Image.fromURL(data[i].filledMaskURL, (oImg) => {
      // scale image down, and flip it, before adding it onto canvas
      // oImg.scale(0.5).setFlipX(true);
      const i = balloonMasks.length;

      /* oImg.on('object:click', function(e){
					console.log(0)
					$("img.listItemImage").attr("src",data[i].originalURL);

				}); */

      oImg.on('object:dblclick', (e) => {
        editMode = true;

        $('.darkroom-icon-cancel').parent().removeClass('disabled');
        $('.darkroom-icon-rotate-left').parent().removeClass('disabled');
        $('.canvasQuickEditor').css('display', 'inline-block');

        $('#canvasQuickEditor').show();

        $('img.listItemImage').attr('src', fileDetails[i].originalURL);
        $('#testTranslation').removeClass('disabled');
        $('#originalText').val('');
        $('#translatedText').val('');

        oImg.set({ opacity: 1.0, selectable: false, hoverCursor: 'default' });

        // check LUT usage for different operations.
        let j = textareaLUTSize[i];
        if (textareaLUTSize[i] < 2 && j < data[i].textRectCount) {
          activeBalloon = i;
          activeRect = j;

          var tectRectCount = data[i].textRectCount;
          var waTop = data[i].textRect[j].y * computedScale + 50 + 52;
          var waLeft = data[i].textRect[j].x * computedScale + 30;
          var waWidth = data[i].textRect[j].width * computedScale;
          var waHeight = data[i].textRect[j].height * computedScale;
          var divTemplate = `<div class='tb-rl writingArea balloon${i} rect${j}'contenteditable></div>`;
          $('div.canvas-container').parent().append(divTemplate);

          var font = $('#canvasQuickEditor select option:selected').val();
          $(`.balloon${i}.rect${j}`).css({
            top: waTop,
            left: waLeft,
            width: waWidth,
            height: waHeight,
            'font-family': font,
            'box-shadow': '0px 0px 2px 1px #66ccff',
            'font-size': globalFontSize,
          });

          if (globalFont != '') {
						   $(`.balloon${i}.rect${j}`).css({ 'font-family': globalFont });
          }

          $('#canvasQuickEditor').css({
            top: waTop,
            left: waLeft + waWidth + 10,
          });

          $(`.balloon${i}.rect${j}`).focus();
          perTextAreaVerticalMode[i][j] = true;

          $(document).on('click', (evt) => {
						   const $tgt = $(evt.target);
						   if (!$tgt.is('li,select,option') && !$tgt.is(`.balloon${i}.rect${j}`) && !$tgt.is('.writingArea div')) {
              editMode = false;
              renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j);
              $(document).off('click');
            }
          });

          textareaLUTSize[i] += 1;
        } else {
          if (data[i].balloonCount == 1) {
            j = 0;
          } else {
            j = 1;
          }

          activeBalloon = i;
          activeRect = j;

          $('#originalText').val('');
          $('#translatedText').val('');

          var tectRectCount = data[i].textRectCount;
          var waTop = data[i].textRect[j].y * computedScale + 50 + 52;
          var waLeft = data[i].textRect[j].x * computedScale + 30;
          var waWidth = data[i].textRect[j].width * computedScale;
          var waHeight = data[i].textRect[j].height * computedScale;
          var divTemplate = `<div class='tb-rl writingArea balloon${i} rect${j}'contenteditable></div>`;

          // remove the last rect.
          var font = $('#canvasQuickEditor select option:selected').val();
          $(`.balloon${i}.rect${j}`).css({
            top: waTop,
            left: waLeft,
            width: waWidth,
            height: waHeight,
            'font-family': font,
            'box-shadow': '0px 0px 2px 1px #66ccff',
          });
          $('#canvasQuickEditor').css({
            top: waTop,
            left: waLeft + waWidth + 10,
          });


          $(`.balloon${i}.rect${j}`).focus();
          $(document).on('click', (evt) => {
            const $tgt = $(evt.target);
            if (!$tgt.is('li,select,option') && !$tgt.is(`.balloon${i}.rect${j}`) && !$tgt.is('.writingArea div')) {
              editMode = false;
              renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j);
              $(document).off('click');
            }
          });
        }
      });
      balloonMasks.push(oImg);
      canvas.add(oImg);
      addBalloonMasks(canvas, data, i + 1, computedScale);
      // canvas.bringToFront(oImg);
    }, {
      left: data[i].boundingRect.x * computedScale, top: data[i].boundingRect.y * computedScale, width: data[i].boundingRect.width * computedScale, height: data[i].boundingRect.height * computedScale, opacity: 0.10, selectable: true, hasControls: false, lockMovementX: true, lockMovementY: true, hasBorders: false, hoverCursor: 'pointer',
    });
		 }
}

function initializeBalloonChecker(canvas, width, height, originalImage, data) {
  // preload balloon images
  const preload = new Array();
  for (var i = 0; i < fileDetails.balloonCount; i++) {
    preload[i] = new Image();
    preload[i].src = data[i].originalURL;
  }

  // Initialize helpers
  function dataURLtoBlob(dataurl) {
		    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
		        bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
		    while (n--) {
		        u8arr[n] = bstr.charCodeAt(n);
		    }
		    return new Blob([u8arr], { type: mime });
  }

  $('#balloonChecker').hide();
  // trigger save button

  $('.darkroom-icon-save').parent().click((ev) => {
    ev.preventDefault();
    // open result in new windows.
    const originalScale = canvasScale;
    zoomTo(canvas, 1);
    canvas.deactivateAll().renderAll();

    const d = canvas.toDataURL(({
      format: 'jpeg',
      quality: 0.9,
    }));
    const strDataURI = d.substr(22, d.length);
    // var w=window.open('about:blank','image from canvas');
    // w.document.write("<img src='"+d+"' alt='from canvas'/>");

    const blob = dataURLtoBlob(d);
      		const objurl = URL.createObjectURL(blob);

    $('#saveImg')[0].href = objurl;
    $('#saveImg')[0].download = `e-${data.fileName.substring(data.fileName.lastIndexOf('/') + 1)}`;
    $('#saveImg')[0].click();

    zoomTo(canvas, originalScale);
  });

		 canvas.on('selection:cleared', (e) => {
    if (!editMode) {
      $('.darkroom-icon-cancel').parent().addClass('disabled');
      $('.darkroom-icon-rotate-left').parent().addClass('disabled');
      $('.canvasQuickEditor').css('display', 'none');
    }
  });
  canvas.on('object:selected', (e) => {
    $('.darkroom-icon-cancel').parent().removeClass('disabled');
    $('.darkroom-icon-rotate-left').parent().removeClass('disabled');
    $('.canvasQuickEditor').css('display', 'inline-block');
  });

  // trigger add routine
  $('.darkroom-icon-add').parent().click((ev) => {
    ev.preventDefault();

    // add a mouse down trigger.
    let rect,
      isDown,
      origX,
      origY;
    function addRectMouseDown(o) {
      isDown = true;
      var pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      var pointer = canvas.getPointer(o.e);
      rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        fill: 'rgba(255,0,0,0.5)',
        transparentCorners: false,
      });
      canvas.add(rect);
    }

    function addRectMouseMove(o) {
      if (!isDown) return;
      const pointer = canvas.getPointer(o.e);

      if (origX > pointer.x) {
        rect.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        rect.set({ top: Math.abs(pointer.y) });
      }

      rect.set({ width: Math.abs(origX - pointer.x) });
      rect.set({ height: Math.abs(origY - pointer.y) });

      canvas.renderAll();
    }

    function addRectMouseUp(o) {
      if (isDown) {
        isDown = false;
        canvas.off('mouse:down', addRectMouseDown);
        canvas.off('mouse:move', addRectMouseMove);
        canvas.off('mouse:up', addRectMouseUp);


        const i = data.balloonCount;
        var j = textareaLUTSize[i];
        editMode = true;


        // currently 10 more manual rect supported.
        // this can be set manually.
        // However, 10 is enough. I think.

        var j = textareaLUTSize[i];
        activeBalloon = i;
        activeRect = j;

        $('#originalText').val('');
        $('#translatedText').val('');

        const pointer = canvas.getPointer(o.e);

        const waTop = rect.top;
        const waLeft = rect.left;
        const waWidth = Math.abs(origX - pointer.x);
        const waHeight = Math.abs(origY - pointer.y);
        const divTemplate = `<div class='tb-rl writingArea balloon${i} rect${j}'contenteditable></div>`;
        $('div.canvas-container').parent().append(divTemplate);
        $(`.balloon${i}.rect${j}`).css({
          top: waTop + 102,
          left: waLeft + 30,
          width: waWidth,
          height: waHeight,
          'min-height': waHeight,
          'box-shadow': '0px 0px 2px 1px #66ccff',
        });

        $('#canvasQuickEditor').show();
        $('#canvasQuickEditor').css({
          top: waTop,
          left: waLeft + waWidth + 10,
        });

        const newRect2 = new fabric.Rect({
          left: rect.left,
          top: rect.top,
          fill: 'rgba(255,255,255,1.0)',
          width: rect.width,
          height: rect.height,
          selectable: false,
          hasControls: false,
        });
        canvas.add(newRect2);
        additionalTextareaMask[j] = newRect2;

        perTextAreaVerticalMode[i][j] = true;

        $(`.balloon${i}.rect${j}`).focus();

        $(document).on('mousedown', (evt) => {
          const $tgt = $(evt.target);
          if (!$tgt.is('li,select,option') && !$tgt.is(`.balloon${i}.rect${j}`) && !$tgt.is('.writingArea div')) {
            editMode = false;
            renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j);

            $(document).off('mousedown');
          }
        });

        textareaLUTSize[i] += 1;
        canvas.remove(rect);
      }
    }

    canvas.on('mouse:down', addRectMouseDown);
    canvas.on('mouse:move', addRectMouseMove);
    canvas.on('mouse:up', addRectMouseUp);
  });


  // append quick editor

  $('.darkroom-toolbar button').click((ev) => {
    ev.preventDefault();
  });
  // $("#steps-uid-0-p-1 div.canvas-container").parent().append("<div id='canvasQuickEditor'><ul><li id='canvasQuickEditor-Font'><select><option value='Simhei'>é»‘ä½“</option><option value='Simsun'>å®‹ä½“</option><option value='å¹¼åœ†'>å¹¼åœ†</option><option value='æ–¹æ­£å¡é€šç®€ä½“'>æ–¹æ­£å¡é€šç®€ä½“</option><option value='æ–¹æ­£æ­£é»‘'>æ–¹æ­£æ­£é»‘</option><option value='Microsoft Yahei'>å¾®è½¯é›…é»‘</option><option value='Hiragino Sans GB'>æŸŠé‡Žéžè¡¬çº¿-GB</option></select></li><li id='canvasQuickEditor-Enlarge'>T+</li><li id='canvasQuickEditor-Shrink'>T-</li><li id='canvasQuickEditor-Bold'>B</li><li id='canvasQuickEditor-Rotate'>R</li><li id='canvasQuickEditor-Delete'>X</li></ul></div>");
  $('#canvasQuickEditor-Font select').change(() => {
    const i = activeBalloon;
    const j = activeRect;
    const font = $('#canvasQuickEditor-Font select option:selected').val();
    globalFont = font;
    $(`.balloon${i}.rect${j}`).css('font-family', font);
    if (!editMode) {
      renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
    }
  });

  let timeoutId = 0;

  $('#canvasQuickEditor-Enlarge').mousedown((ev) => {
    ev.preventDefault();
    // clear font size cache
    fontSizeCache = [];

    const i = activeBalloon;
    const j = activeRect;

    const top = $('#canvasQuickEditor').css('top') + 102;
    const left = $('#canvasQuickEditor').css('left') + 30;

    const fontSize = parseInt($(`.balloon${i}.rect${j}`).css('font-size'), 10) + 1;
    globalFontSize = fontSize;

    $(`.balloon${i}.rect${j}`).css('font-size', `${fontSize}px`);
    if (!editMode) {
      renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
    }
    $('#canvasQuickEditor').css({ top, left });

    timeoutId = setInterval(() => {
      fontSizeCache = [];

      const i = activeBalloon;
      const j = activeRect;

      const top = $('#canvasQuickEditor').css('top') + 102;
      const left = $('#canvasQuickEditor').css('left') + 30;

      const fontSize = parseInt($(`.balloon${i}.rect${j}`).css('font-size'), 10) + 1;
      globalFontSize = fontSize;

      $(`.balloon${i}.rect${j}`).css('font-size', `${fontSize}px`);
      if (!editMode) {
        renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
      }
    }, 150);
  }).bind('mouseup mouseleave', () => {
    clearInterval(timeoutId);
  });

  $('#canvasQuickEditor-Shrink').mousedown((ev) => {
    ev.preventDefault();
    // clear font size cache
    fontSizeCache = [];

    const i = activeBalloon;
    const j = activeRect;

    const top = $('#canvasQuickEditor').css('top');
    const left = $('#canvasQuickEditor').css('left');

    const fontSize = parseInt($(`.balloon${i}.rect${j}`).css('font-size'), 10) - 1;
    globalFontSize = fontSize;

    $(`.balloon${i}.rect${j}`).css('font-size', `${fontSize}px`);
    if (!editMode) {
      renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
    }
    $('#canvasQuickEditor').css({ top, left });


    timeoutId = setInterval(() => {
      fontSizeCache = [];

      const i = activeBalloon;
      const j = activeRect;

      const top = $('#canvasQuickEditor').css('top');
      const left = $('#canvasQuickEditor').css('left');

      const fontSize = parseInt($(`.balloon${i}.rect${j}`).css('font-size'), 10) - 1;
      globalFontSize = fontSize;

      $(`.balloon${i}.rect${j}`).css('font-size', `${fontSize}px`);
      if (!editMode) {
        renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
      }
      $('#canvasQuickEditor').css({ top, left });
    }, 150);
  }).bind('mouseup mouseleave', () => {
    clearInterval(timeoutId);
  });

  $('#canvasQuickEditor-Bold').mousedown((e) => {
    const i = activeBalloon;
    const j = activeRect;
    const isBold = $(`.balloon${i}.rect${j}`).css('font-weight');
    if (isBold == 'bold' || isBold == '700' || parseInt(isBold, 10) == 700) {
      $(`.balloon${i}.rect${j}`).css('font-weight', 'normal');
    } else {
      $(`.balloon${i}.rect${j}`).css('font-weight', 'bold');
    }
    if (!editMode) {
      renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
    }
  });

  $('#canvasQuickEditor-Rotate').mousedown(function (ev) {
    if (!$(this).hasClass('disabled')) {
      ev.preventDefault();
      const i = activeBalloon;
      const j = activeRect;
      const isVertical = perTextAreaVerticalMode[i][j];
      perTextAreaVerticalMode[i][j] = !perTextAreaVerticalMode[i][j];

      if (isVertical) {
        $(`.balloon${i}.rect${j}`).removeClass('tb-rl');
        $(`.balloon${i}.rect${j}`).addClass('lr-tb');
      } else {
        $(`.balloon${i}.rect${j}`).removeClass('lr-tb');
        $(`.balloon${i}.rect${j}`).addClass('tb-rl');
      }

      if (!editMode) {
        renderContent(canvas, $(`.balloon${i}.rect${j}`), i, j, true);
      }
    }
  });

  $('#canvasQuickEditor-Delete').mousedown(function (ev) {
    if (!$(this).hasClass('disabled')) {
      ev.preventDefault();
      const i = activeBalloon;
      const j = activeRect;

      if (i != fileDetails.balloonCount) {
        for (var t = 0; t < textareaLUTSize[i]; t++) {
          $(`.balloon${i}.rect${t}`).remove();
          canvas.remove(textareaLUT[i][t]);
        }

        textareaLUT[i].length = 0;
        textareaLUT[i] = Array(10);
        textareaLUTSize[i] = 0;
        balloonMasks[i].set({ opacity: 0.1, selectable: true, hoverCursor: 'pointer' });
        canvas.renderAll();

        $('#canvasQuickEditor').hide();
      } else {
        canvas.remove(textareaLUT[i][j]);

        canvas.remove(additionalTextareaMask[j]);
        textareaLUTSize[i] -= 1;
        for (var t = j; t < textareaLUTSize; t++) {
          textareaLUT[i][t] = textareaLUT[i][t + 1];

          additionalTextareaMask[t] = additionalTextareaMask[t + 1];

          // refresh each textarea
          const obj = textareaLUT[i][t];
          const waTop = obj.top + 52;
          const waLeft = obj.left;
          const waWidth = obj.width;
          const waHeight = obj.height;

          $(`.balloon${i}.rect${t}`).css({
            top: waTop,
            left: waLeft,
            width: waWidth,
            height: waHeight,
            opacity: 0.9,
            'box-shadow': '0px 0px 2px 1px #66ccff',
					 });
        }
        $('#canvasQuickEditor').hide();
      }
    }
  });

  // initial editing sequence
  const loadedImageCount = 0;
  canvas.on('after:render', () => { canvas.calcOffset() });
  canvas.on('object:scaling', (ev) => { onObjectScaled(canvas, ev, data.balloonCount) });
  canvas.on('object:selected', (ev) => { onObjectSelected(canvas, ev, data.balloonCount) });
  canvas.on('object:moving', (ev) => { onObjectSelected(canvas, ev, data.balloonCount) });
  canvas.setHeight(height);
  canvas.setWidth(width);
  const clickableRects = Array();

  textareaLUT = new Array(data.balloonCount);
  perTextAreaVerticalMode = new Array(data.balloonCount + 1);

  additionalTextareaMask = new Array(20);
  textareaLUTSize = new Array();
  for (var i = 0; i < data.balloonCount + 1; i++) {
    textareaLUT[i] = new Array(20);
    textareaLUTSize.push(0);
    perTextAreaVerticalMode[i] = new Array(20);
  }

  fabric.Image.fromURL(originalImage, (oImg) => {
			  canvas.add(oImg);
			  canvas.sendToBack(oImg);
			  // loadedImageCount += 1;
			  // if(loadedImageCount == data.balloonCount + 1)
			  // {
    computedScale = (screenWidth * 0.46667 - 62) / width;
    console.log(computedScale);
    addBalloonMasks(canvas, data, 0, computedScale);
    zoomTo(canvas, 1 / computedScale);

    $('#balloonChecker').fadeIn();
    $('#translateAll').removeClass('disabled');
			  // }
  }, {
    left: 0, top: 0, width: data.dim.cols, height: data.dim.rows, opacity: 1, selectable: false, hasControls: false,
  });
}


$(document).ready(() => {
  // $("li.darkroom-button-group").css("opacity","0");
  $('#openGomiBox ').css('margin-top', '50px');


  // new type of file upload handler.

  /* $("#dropbox").click(function(e){
			$("#fileupload").click();
		}) */

  $('#fileupload').fileupload({
    url: 'upload/',
    sequentialUploads: true,
    type: 'POST',
    progressall(e, data) {
      const progress = parseInt(data.loaded / data.total * 100, 10);
      $('#progress .bar').css('width', `${progress}%`);
    },
		  });

  /* var myDropzone = new Dropzone("div#dropbox", { url: "/upload/",
														method : "post",
														maxFiles : 1,
														acceptedFiles : "image/*"
													}); */

  // myDropzone.on("success", function(file,response) {
  // myDropzone.removeFile(file);
  // alert(response);
  const imgArr = new Array( // relative paths of images
		 'img/intro-1.png',
		 'img/intro-2.png'
  );

  const preloadArr = new Array();

  /* preload images */
  for (let i = 0; i < imgArr.length; i++) {
    preloadArr[i] = new Image();
    preloadArr[i].src = imgArr[i];
  }

  $('#fileupload').bind('fileuploadadd', (e, file) => {
    function changeImg() {
      $('#dropbox').css('background-image', `url(${preloadArr[currImg++ % preloadArr.length].src})`);
    }
    var currImg = 1;
    changeImg();
    const intID = setInterval(changeImg, 5000);
  });

  $('#fileupload').bind('fileuploaddone', (e, file) => {
    // $("div.actions").fadeIn();

    // initialize and render canvas -> async
    const rawfile = file.files[0];
    // console.log(file);
    const reader = new FileReader(rawfile);
    reader.readAsDataURL(rawfile);
    reader.onload = function (e) {
      fileDetails = $.parseJSON(file.result);
      const data = e.target.result;
      originalImage = data;
			    const	canvas = new fabric.CanvasEx('balloonChecker');
      globalCanvas = canvas;
      initializeBalloonChecker(canvas, fileDetails.dim.cols, fileDetails.dim.rows, originalImage, fileDetails);
    };

    $('#dropbox').fadeOut();
    setTimeout(() => {
      $('#progress .bar').fadeOut();
    }, 1000);
  });

  $('div.actions').hide();
  $('#disqus_thread').hide();

  $('#openGomiBox').click(() => {
    $('#disqus_thread').toggle();
  });

  // page scroll
  let verticalFlag = false;
  $(document).scroll(() => {
    const d = $(document).scrollTop();
    // console.log(d);
    if (d > 350) {
      verticalFlag = true;
      if (verticalFlag) {
        $('#balloonCheckerTooltipList').css({
          position: 'fixed',
          top: '30px',
          width: '40%',
        });
      }
    } else if (verticalFlag) {
      verticalFlag = false;
      $('#balloonCheckerTooltipList').css({
        position: 'relative',
        top: '0px',
        width: 'auto',
      });
    }
  });

  // dropbox styles
  $(document).bind('dragover', (e) => {
    		let dropZone = $('#dropzone'),
       		 timeout = window.dropZoneTimeout;
   		 if (!timeout) {
      		  dropZone.addClass('in');
   		} else {
     		   clearTimeout(timeout);
  		  }
   		 let found = false,
      		  node = e.target;
   		 do {
       		 if (node === dropZone[0]) {
            		found = true;
          		  break;
        		}
       		 node = node.parentNode;
    		} while (node != null);
    		if (found) {
        		$('#dropbox').css('opacity', '0.7');
    		} else {
        		$('#dropbox').css('opacity', '1');
    		}
    		window.dropZoneTimeout = setTimeout(() => {
        		window.dropZoneTimeout = null;
        		$('#dropbox').css('opacity', '1');
   		 }, 100);
  });
});

// Translations
$('#testTranslation').on('click', function (e) {
  if (!$(this).hasClass('disabled') && activeBalloon < fileDetails.balloonCount) {
    $('#translationIndicator').show();
    $.ajax({
      url: 'translate/',
		        dataType: 'json',
		        method: 'POST',
		        data: { id: fileDetails.id, fname: fileDetails[activeBalloon].originalURL.split('/').pop() },
		        success(data) {
	            	$('#translations #originalText').val(data.text);
	            	$('#translations #translatedText').val(data.translatedText);
	            	$('#translationIndicator').fadeOut();
      },
    });
  }
});

// Translations
$('#translateAll').on('click', (e) => {
  $('#translationIndicator').show();
  $.ajax({
    url: 'translateAll/',
	        dataType: 'json',
	        method: 'POST',
	        data: { id: fileDetails.id },
	        success(data) {
      console.log(data);
      $('textarea#translateAllResults').attr('rows', data.result.length);
      $('textarea#translateAllResults').html('');
      for (let i = 0; i < data.result.length; i++) {
        $('textarea#translateAllResults').append(data.result[i]);
        if (i != data.result.length - 1) {
          $('textarea#translateAllResults').append('\n');
        }
      }
      $('#translationIndicator').fadeOut();

      // bind click event
      $('#translateAllResults').off('click');
      $('#translateAllResults').on('click', (ev) => {
        const t = $('#translateAllResults')[0];
        const currentLine = (t.value.substr(0, t.selectionStart).split('\n').length);
        globalCanvas.setActiveObject(balloonMasks[data.orders[currentLine - 1]]);
      });


      $('textarea#translateAllResults').fadeIn();
    },
  });
});


// //////////////////////////////////////////
/*
/*    CHANGELOG - By Miaomiao li
/*
////////////////////////////////////////////

Alpha Phase

v 0.1
Initial Release, with this release we can:

+  load image and parse balloons
+  add rectangle to each balloon
+  automatically fill balloon and generate text objects
+  save the work you have done.

v 0.2
Small bug fixes.

+ Enable multiple textarea support.
+ Fix bugs on canvas saving.
+ avoid too small rectangle generated(server side)

v 0.3
Happy new year! It's my pleasure to share this public beta version to my kind friends.

+ Enable font panel with advanced ineractives.
+ A simple stupid resize for small manga input.

v 0.4
I heard the sound of a bell far away. Still happy new year!

+ Finally solved small input error.
+ Smooth canvas object height control. ( avoid text leakage when force adding a rectangle. )
+ Add force textarea routines.
+ Small interactive improve

v 0.5
Public Release

+ Multiple bug fix.

v 0.6
Testing version for future optimization.

+ Add horizontal support
+ Add bold text toggle.
+ Add feature to remove a balloon with error.
+ Global font and size settings.

v 0.7
Testing version of UI & Graphics

+ Revamped uploading boxes.
+ Control bar integration.

v 0.9
Rewritten in Flask

v 1.0
My old code sucks.

+  Totally rewrite code to bootstrap
+  introduce OCR(beta) and Beegle Translation
+  Better frontend design.

v 1.1
Optimize the canvas download logics
Optimize for result clicks
Reduced download file size by enabling jpeg compression
Refined downloaded file name

v 1.1b
Oh my old codes really suck.
Could not be any sucker.
This is the version for everyday use.

Fixed the manual addition routines.
Fixed the rotation bugs.
Changed the manual addition behavior
Fixed the style change bugs
Fixed the min-width weird behavior
Revamp the sidebar rotation styles.
Fixed the bug when clicking to the filled regions may cause the hideen translated text.
Now you cannot try to translated self-defined regions.
Fix the scorlling layout.

v 1.2
New Feature: Extract All texts.

v 1.2a
Show balloon detail when clicking on the textarea.

Known bugs

+ sidebar style issues
+ CORS ajax support for firefox failed.

TODO:

+ Trying to match font-size with original template
+ Redesign text editing logic.
+ Escape for special characters.
+ Line-height for vertical texts.
+ Sidebar panel off-site editing.
+ Mask half of the balloon when there is multiple rectangles.
+ Search for nearest neighbour to activate, but not in order.
+ Shortcuts
+ Mask only half of the balloon, when there are multiple candidates.
+ Server optimization
+ Scribble tool ( under consideration )

*/



