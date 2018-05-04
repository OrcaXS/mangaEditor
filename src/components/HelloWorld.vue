<template lang="pug">
#app
  form#uploadForm(
    method='post'
    enctype='multipart/form-data'
  )
    .file
      label.file-label(for='image_uploads')
        input#image_uploads.file-input(
          type='file'
          name='files'
          accept='.jpg, .jpeg, .png'
          multiple
        )
        span.file-cta
          span.file-icon
            i.fas.fa-upload
          span.file-label Choose a file...
    .preview
      p No files currently selected for upload
    div
      input(type='submit' value='submit')
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
