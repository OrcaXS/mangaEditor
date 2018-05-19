<template>
  <div class="LeftPanel">
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Elements</div>
      <div class="LeftPanel-layer">
        <FontAwesomeIcon :icon="['far', 'circle']" />
        Custom Textbox 1
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">Balloons</div>
      <div class="LeftPanel-layer">
        <FontAwesomeIcon :icon="['far', 'circle']" />
        Balloon 1
      </div>
    </div>
    <div class="LeftPanel-group">
      <div class="LeftPanel-category">BG</div>
      <div class="LeftPanel-layer">
        <FontAwesomeIcon :icon="['far', 'image']" />
        Layer 1
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'EditorLeftPanel',
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped lang="postcss">
.LeftPanel {
  height: calc(100vw - 3rem);
  /* border: 1px solid config('colors.grey-light'); */
  background-color: config('colors.peach-lighter');
}

.LeftPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  /* margin: .1rem 0; */
}

.LeftPanel-layer {
  font-weight: 500;
  padding: .5rem .1rem;
  color: config('colors.grey-darker');
}

.LeftPanel-balloons {
}

.LeftPanel-bg {
}
</style>
