<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva">
      <v-layer ref="layer">
        <v-circle :config="configCircle"/>
      </v-layer>
    </v-stage>

    <div>
      <input
        id="fileinput"
        type="file"
        accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"
        @change="upload" >
    </div>

    <div id="showcase"/>

  </div>

</template>

<script>
import uploadPicture from '../scripts/upload.js';
import Vue from 'vue';

const bgLayer = new Konva.Layer();
const fgLayer = new Konva.Layer();

function loadFromURLs(response, index, maxindex) {
  if (index < maxindex) {
    Konva.Image.fromURL(response[index].resultURL, (image) => {
      console.log(response, index, response[index]);
      image.draggable(true);
      image.setAttrs({
        x: response[index].boundingRect.x,
        y: response[index].boundingRect.y,
      });
      balloons.push(image);
      bgLayer.add(image);
      bgLayer.draw();
      loadFromURLs(response, index + 1, maxindex);
    });
  }
}

export default {
  name: 'Canvas',
  data() {
    return {
      configKonva: {
        width: 200,
        height: 200,
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
      },
      konvaObjs: {
        stage: {},
        balloons: [],
      },
    };
  },
  methods: {
    async upload(e) {
      const data = new FormData();
      data.append('files', e.srcElement.files[0]);
      const response = await uploadPicture(data);

      stage = new Konva.Stage({
        container: 'showcase',
        width: response.dim.cols,
        height: response.dim.rows,
      });

      stage.add(bgLayer);
      Konva.Image.fromURL(response.fileName, (image) => {
        bgLayer.add(image);
        bgLayer.draw();
      });


      stage.add(fgLayer);
      loadFromURLs(response, 0, response.balloonCount);
    },
  },
};
</script>
