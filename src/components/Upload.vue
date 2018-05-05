<template lang="pug">
#app
  form#uploadForm(
    method='post'
    enctype='multipart/form-data'
    v-on:submit.prevent
  )
    .file
      label.file-label(for='image_uploads')
        input#image_uploads.file-input(
          type='file'
          name='files'
          accept='.jpg, .jpeg, .png'
          ref='uploadInput'
          multiple
          @change='previewFile'
        )
        span.file-cta
          span.file-icon
            i.fas.fa-upload
          span.file-label Choose a file...
    .preview
      p No files currently selected for upload
    div
      input(type='submit' value='submit' @click='submitUpload')
</template>

<script>
export default {
  name: 'Upload',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      file: [],
    };
  },

  computed: {
    parts() {
      return this.$store.file.parts;
    },
  },

  methods: {
    previewFile(e) {
      [this.file] = e.target.files;
    },
    submitUpload() {
      const formData = new FormData();
      const img = this.$refs.uploadInput.files;
      formData.append('files', img[0]);
      this.$store.dispatch('fetchParts', { formData });
    },
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
