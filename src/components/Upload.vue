<template>
  <layout-default>
    <div class="Upload">
      <form
        id="uploadForm"
        method="post"
        enctype="multipart/form-data"
        @submit.prevent
      />
      <div
        class="Upload-dragZone"
        @dragenter.stop.prevent
        @dragover.stop.prevent
        @drop.stop.prevent="dragDropHandler"
      >
        <div class="Upload-hint">
          <label
            class="Upload-label btn btn-blue"
            for="image_uploads"
          >
            <input
              id="image_uploads"
              ref="uploadInput"
              class="Upload-fileInput"
              type="file"
              name="files"
              accept=".jpg, .jpeg, .png"
              multiple
              @change="uploadBtnHandler"
            >
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload" />
                <span class="file-label">
                  Choose a file...
                </span>
              </span>
            </span>
          </label>
          <span class="Upload-dragText">... Or drag the file inside</span>
        </div>
        <div
          v-if="fileSelected"
          class="Upload-preview"
        >
          <img
            :src="fileDataUri"
            class="preview-img"
          >
        </div>
      </div>
      <div
        v-if="isUploading"
        role="alert"
        class="Upload-errInfo border border-blue-light rounded bg-blue-lightest px-4 py-3 text-blue-dark">
        <p>
          Uploading file...
        </p>
      </div>
      <div
        v-if="errInfo!==''"
        role="alert"
        class="Upload-errInfo border border-red-light rounded bg-red-lightest px-4 py-3 text-red-dark">
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

    </div>
  </layout-default>
</template>

<script>
import LayoutDefault from '@/layouts/Default';

export default {
  name: 'Upload',
  components: {
    LayoutDefault,
  },

  data() {
    return {
      validFileType: [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
      ],
      file: [],
      fileDataUri: '',
      fileSelected: false,
      isUploading: false,
      errInfo: '',
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
  },

  methods: {
    uploadBtnHandler(e) {
      [this.file] = e.target.files;
      this.previewFile();
    },

    previewFile() {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.fileDataUri = reader.result;
      }, false);
      reader.readAsDataURL(this.file);
      this.fileSelected = true;
    },

    async submitUpload() {
      const formData = new FormData();
      const img = this.$refs.uploadInput.files;
      formData.append('files', img[0]);
      try {
        this.isUploading = true;
        await this.$store.dispatch('fetchParts', { formData });
      } catch (error) {
        this.isUploading = false;
        console.error(error);
        this.errInfo = error.message;
      }
      await this.$store.dispatch('setLocalImage', { data: this.fileDataUri });
      // await this.$store.dispatch('setLocalBlob', { blobUrl: this.fileObjUrl });
    },

    dragDropHandler(e) {
      const { dataTransfer } = e;
      const { files } = dataTransfer;
      [this.file] = files;
      this.previewFile();
    },
  },
};
</script>

<style scoped lang="postcss">
/** @define Upload */

.Upload {
  padding: 1em;
}

.Upload-preview {
  width: 100%;
  margin-top: 1em;
}

.Upload-fileInput {
  display: none;
}

.Upload-dragZone {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;

  min-height: 60vw;

  border: 4px dashed config('colors.grey-darker');
  padding: 1rem;
  margin: 1rem 0;
}

.Upload-hint {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.Upload-dragText {
  margin-left: 1rem;
}

.Upload-submit {
  margin: 1rem 0;
}

.Upload-label {
  display: inline-block;
}

.Upload-errInfo {
}

.preview-img {
  width: 100%;
}
</style>
