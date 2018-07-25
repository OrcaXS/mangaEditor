<template>
  <div class="Upload">
    <form
      v-if="!isUploading"
      id="uploadForm"
      method="post"
      enctype="multipart/form-data"
      @submit.prevent
    >
      <label
        class="Upload-dragZone"
        for="image_uploads"
        @dragenter="dragEnterHandler"
        @dragover.stop.prevent
        @dragleave="dragLeaveHandler"
        @drop.stop.prevent="dragDropHandler"
      >
        <div
          v-if="draggedIn"
          class="Upload-dragged"
        >
          <span v-t="{ path: 'upload.release' }">Release</span>
        </div>
        <template v-else>
          <span
            v-t="{ path: 'upload.click' }"
            class="Upload-clickText"
          />
          <input
            id="image_uploads"
            ref="uploadInput"
            class="Upload-fileInput"
            type="file"
            name="files"
            accept=".jpg, .jpeg, .png"
            @change="uploadBtnHandler"
          >
          <span>
            <FontAwesomeIcon
              class="Upload-faIcon"
              icon="plus"
            />
          </span>
          <span
            v-t="{ path: 'upload.drag_file' }"
            class="Upload-dragText"
          />
        </template>
      </label>
    </form>
    <div
      v-if="isUploading"
      role="alert"
      class="Upload-errInfo border border-blue-light rounded bg-blue-lightest px-4 py-3 text-blue-dark">
      <p v-t="{ path: 'upload.uploading' }" />
    </div>
    <div
      v-if="!!errInfo"
      role="alert"
      class="Upload-errInfo border border-red-light rounded bg-red-lightest px-4 py-3 text-red-dark"
    >
      <p>
        Cannot submit file: {{ errInfo }}
      </p>
    </div>
    <div
      v-if="fileSelected"
      class="Upload-submit flex justify-center"
    >
      <input
        :value="submitText"
        class="btn btn-blue"
        type="submit"
        @click="submitUpload"
      >
    </div>
    <div
      v-if="localStorageRdy"
      role="alert"
      class="Upload-errInfo border border-blue-light rounded bg-blue-lightest px-4 py-3 text-blue-dark"
    >
      <AssetsDownload :id="lastFileId"/>
    </div>
  </div>
</template>

<script>
import LayoutDefault from '@/layouts/Default';
import AssetsDownload from '@/components/AssetsDownload';
import db from '@/scripts/db';

export default {
  name: 'Upload',
  components: {
    LayoutDefault,
    AssetsDownload,
  },

  data() {
    return {
      validFileType: [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
      ],
      draggedIn: false,
      file: {},
      fileDataUri: '',
      fileObjUri: '',
      fileSelected: false,
      isUploading: false,
      errInfo: null,
    };
  },

  computed: {
    fileSize() {
      const number = this.file.size;
      if (number > 1024 && number < 1048576) return `${(number / 1024).toFixed(1)}KB`;
      if (number > 1048576) return `${(number / 1048576).toFixed(1)}MB`;
      return `${number}bytes`;
    },

    submitText() {
      return `Submit ${this.file.name}(${this.fileSize})`;
    },

    localStorageRdy() {
      return this.$store.state.file.status.localStorageRdy;
    },

    lastFileId() {
      return this.$store.state.file.lastId;
    },
  },

  methods: {
    uploadBtnHandler(e) {
      [this.file] = e.target.files;
      this.checkFile();
    },

    checkFile() {
      console.log(this.file.type);
      if (this.validFileType.indexOf(this.file.type) > -1) {
        this.submitUpload();
      } else {
        this.errInfo = 'Invalid File Type';
      }
    },

    async setPreview() {
      await db.setPreview({ data: this.file });
    },


    async previewFile() {
      // const readFile = (file) => {
      //   const tempFileReader = new FileReader();
      //   return new Promise((resolve, reject) => {
      //     tempFileReader.onerror = () => {
      //       tempFileReader.abort();
      //       reject(new DOMException('Problem parsing input file.'));
      //     };
      //     tempFileReader.onload = () => {
      //       resolve(tempFileReader.result);
      //     };
      //     tempFileReader.readAsDataURL(file);
      //   });
      // };
      //
      // this.fileDataUri = await readFile(this.file);
      try {
        await this.setPreview();
        await this.getPreview();
        this.fileSelected = true;
      } catch (e) {
        console.error(e);
        this.errInfo = e.message;
      }
      // await this.$store.dispatch('setPreview', { dataUri: this.fileDataUri, filename: this.file.name });
    },

    async submitUpload() {
      const formData = new FormData();
      formData.append('files', this.file);
      try {
        await db.setPreview({ data: this.file });
        await db.initFiles();
        this.isUploading = true;
        await this.$store.dispatch('fetchParts', { formData });
      } catch (e) {
        this.isUploading = false;
        console.error(e);
        this.errInfo = e.message;
      }
    },

    dragEnterHandler(e) {
      this.draggedIn = true;
    },

    dragLeaveHandler(e) {
      this.draggedIn = false;
    },

    dragDropHandler(e) {
      this.draggedIn = false;
      this.errInfo = null;
      const { dataTransfer } = e;
      const { files } = dataTransfer;
      [this.file] = files;
      this.checkFile();
    },
  },
};
</script>

<style scoped lang="postcss">
/** @define Upload */

.Upload {
}

.Upload-fileInput {
  display: none;
}

.Upload-faIcon {
  font-size: 8em;
}

.Upload-dragZone {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  width: 360px;
  height: 240px;
  border: 2px dashed config('colors.peach-shade-2');
  color: config('colors.peach-shade-1');
}

.Upload-hint {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.Upload-dragged {
  cursor: copy;
}

.Upload-dragText {
  margin: 1em 0;
}

.Upload-clickText {
  margin: 1em 0;
}

.Upload-submit {
  margin: 1rem 0;
}

.Upload-errInfo {
}
</style>
