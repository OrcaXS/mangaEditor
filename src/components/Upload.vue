<template>
  <layout-default>
    <div>
      <form
        id="uploadForm"
        method="post"
        enctype="multipart/form-data"
        @submit.prevent
      />
      <div class="file">
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
            @change="previewFile"
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
        <div
          v-if="fileSelected"
          class="Upload-preview"
        >
          <img
            :src="fileObjUrl"
            class="preview-img"
          >
          <p>{{ file.name }} {{ fileSize }}</p>
        </div>
        <p v-else>No files currently selected for upload</p>
        <input
            class="btn btn-blue"
            type="submit"
            value="submit"
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
      fileObjUrl: '',
      fileSelected: false,
    };
  },

  computed: {
    fileSize() {
      const number = this.file.size;
      if (number > 1024 && number < 1048576) return `${(number / 1024).toFixed(1)}KB`;
      if (number > 1048576) return `${(number / 1048576).toFixed(1)}MB`;
      return `${number}bytes`;
    },
  },

  methods: {
    previewFile(e) {
      [this.file] = e.target.files;
      this.fileObjUrl = window.URL.createObjectURL(e.target.files[0]);
      this.fileSelected = true;
    },
    submitUpload() {
      const formData = new FormData();
      const img = this.$refs.uploadInput.files;
      formData.append('files', img[0]);
      this.$store.dispatch('fetchParts', { formData });
      this.$store.dispatch('setLocalBlob', { blobUrl: this.fileObjUrl });
    },
  },
};
</script>

<style scoped lang="postcss">
/** @define Upload */

.Upload-preview {
  max-width: 90vw;
}

.Upload-fileInput {
  display: none;
}

.Upload-label {
  display: inline-block;
}

.preview-img {
  width: 100%;
}
</style>
