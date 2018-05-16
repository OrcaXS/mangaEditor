<template>
  <div class="RightPanel">
    <div class="RightPanel-balloons">
      <div class="RightPanel-category">Styles</div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'EditorRightPanel',
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped lang="postcss">
.RightPanel {
  height: calc(100vw - 3rem);
  /* border: 1px solid config('colors.grey-light'); */
  background-color: config('colors.peach-lighter');
}

.RightPanel-category {
  background-color: config('colors.peach-light-1');
  text-align: center;
  padding: .25rem 0;
  /* margin: .1rem 0; */
}

.RightPanel-layer {
  font-weight: 500;
  padding: .5rem .1rem;
  color: config('colors.grey-darker');
}

.RightPanel-balloons {
}

.RightPanel-bg {
}
</style>
