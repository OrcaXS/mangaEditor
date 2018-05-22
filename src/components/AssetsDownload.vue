<template>
  <div>Downloading</div>
</template>

<script>
export default {
  name: 'AssetsDownload',
  props: {
    id: {
      type: String,
      required: true,
      validator(val) {
        return /^[a-z0-9]{32}$/.test(val);
      },
    },
  },
  computed: {
    fileData() {
      return this.$store.state.file.fileData[this.id];
    },

    balloonCount() {
      return this.fileData.info.balloonCount;
    }
  },

  methods: {
    isURL(url) {
      return /^http/.test(url);
    },

    downloadAssets() {
      // const urlKeys = ['filledMaskURL', 'originalURL', 'resultURL'];
      const urlKey = 'filledMaskURL';
      for (let i = 0; i < this.balloonCount; i += 1) {
        const balloon = this.fileData.balloons[i];
        if (this.isURL(balloon[urlKey])) this.$store.dispatch('fetchFile', { url: balloon[urlKey], id: this.id, balloonIdx: i });
      }
    },
  },
};
</script>

<style scoped lang="postcss">
</style>
