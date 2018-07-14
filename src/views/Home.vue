<template>
  <layout-default>
    <div class="Home-page">
      <div class="Home-thumbnailGrid">
        <Thumbnail
          v-for="(file, id) in savedFiles"
          :key="id"
          :id="id"
          :filename="file.bgImage.name"
          :img-uri="imageUris[id]"
        />
        <Upload />
      </div>
      <p v-if="formattedStorageSize.percentage">
        Storage used: {{ formattedStorageSize.percentage.toFixed(2) }}%
      </p>
    </div>
  </layout-default>
</template>

<script>
import LayoutDefault from '@/layouts/Default';
import Thumbnail from '@/components/Thumbnail';
import Upload from '@/components/Upload';
import db from '@/scripts/db';

export default {
  name: 'HomeView',
  components: {
    LayoutDefault,
    Thumbnail,
    Upload,
  },
  data() {
    return {
      savedFiles: {},
      imageUris: {},
      availStorage: 0,
    };
  },
  computed: {
    currentFiles() {
      return this.$store.state.file.id;
    },
    formattedStorageSize() {
      return {
        usage: (this.availStorage.usage / 1048576).toFixed(2),
        quota: (this.availStorage.quota / 1048576).toFixed(2),
        percentage: this.availStorage.usage / this.availStorage.quota,
      };
    },
  },
  mounted() {
    this.getFiles();
  },
  methods: {
    async getFiles() {
      const files = await db.getAllFiles();
      this.savedFiles = files;
      if (files) {
        Object.keys(files).forEach((id) => {
          this.imageUris[id] = window.URL.createObjectURL(files[id].bgImage);
        });
      }
      await this.iidbAvailSpace();
    },

    async iidbAvailSpace() {
      const availStorage = await navigator.storage.estimate();
      this.availStorage = availStorage;
    },
  },
};
</script>

<style scoped lang="postcss">
.Home-page {
  margin: 1rem;
}

.Home-thumbnailGrid {
  margin-bottom: 1rem;

  display: grid;
  grid-template-columns: repeat( auto-fill, 360px );
  gap: 2rem 3rem;
  justify-content: center;
}

.Home-usageBar {

  border-radius: 2px;
  background-size: 35px 20px, 100% 100%, 100% 100%;
}

.Home-usageBar::after {
  content: '80%';
  position: absolute;
  right: 0;
  top: -125%;
}

.Home-UploadBox {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;

  width: 360px;
  height: 240px;
  border: 2px dashed config('colors.peach-shade-2');
  color: config('colors.peach-shade-1');
  font-size: 8em;
  /* line-height: 5.0; */
}
</style>
