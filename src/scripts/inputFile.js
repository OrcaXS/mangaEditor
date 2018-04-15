const input = document.querySelector('input');
const preview = document.querySelector('.preview');
const fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png',
];

function updateImageDisplay() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
  if (curFiles.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    const list = document.createElement('ol');
    preview.appendChild(list);
    for (let i = 0; i < curFiles.length; i += 1) {
      const listItem = document.createElement('li');
      const para = document.createElement('p');
      if (validFileType(curFiles[i])) {
        para.textContent = `File name ${curFiles[i].name}, file size ${returnFileSize(curFiles[i].size)}.`;
        const image = document.createElement('img');
        image.src = window.URL.createObjectURL(curFiles[i]);

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${curFiles[i].name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }
}


function validFileType(file) {
  for (let i = 0; i < fileTypes.length; i += 1) {
    if (file.type === fileTypes[i]) {
      return true;
    }
  }

  return false;
}

function returnFileSize(number) {
  if (number < 1024) {
    return `${number}bytes`;
  } else if (number > 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)}KB`;
  } else if (number > 1048576) {
    return `${(number / 1048576).toFixed(1)}MB`;
  }
}



export default updateImageDisplay;

