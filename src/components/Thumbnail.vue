<template>
  <div class="Thumbnail-card">
    <router-link :to="{ name: 'editor', params: { file_id: id }}">
      <div
        :style="bgImageStyle"
        class="Thumbnail-image"
      />
    </router-link>
    <p class="Thumbnail-description">{{ filename }}</p>
  </div>
</template>
<script>
export default {
  name: 'Thumbnail',
  props: {
    id: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    imgUri: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    bgImageStyle() {
      return {
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), url(${this.imgUri})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    },
  },
};
</script>
<style scoped lang="postcss">
.Thumbnail-card {

}

.Thumbnail-description {
  margin-top: .5em;
  text-align: center;
  font-size: 1.25em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.Thumbnail-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  width: 100%;
  height: 240px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.25);
}
</style>
