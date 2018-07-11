<template>
  <div v-t="{ path: 'download.balloons_downloading' }" />
</template>

<script>
import remote from '@/scripts/fetchFile';
import db from '@/scripts/db';

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
    },
  },

  mounted() {
    this.downloadAssets();
  },

  methods: {
    isURL(url) {
      return /^http/.test(url);
    },

    async downloadAssets() {
      try {
        const balloonUrls = {};

        // const urlKeys = ['filledMaskURL', 'originalURL', 'resultURL'];
        const urlKey = 'filledMaskURL';
        for (let i = 0; i < this.balloonCount; i += 1) {
          const balloon = this.fileData.balloons[i];

          if (this.isURL(balloon[urlKey])) {
            balloonUrls[i] = balloon[urlKey];
            // fetchBalloons({ url: balloon[urlKey], id: this.id, balloonIdx: i });
          }
        }
        // console.log(balloonUrls);
        await db.movePreviewToFile({ id: this.id });
        await remote.parallelFetchToDb({ id: this.id, balloonUrls, balloonCount: this.balloonCount });

        this.$store.dispatch('clearStatus');
        this.$router.push({ name: 'editor', params: { file_id: this.id } });
      } catch (e) {
        console.error(e);
      }
    },
  },

};
</script>

<style scoped lang="postcss">
</style>
