<template>
  <div class="DefaultLayout">
    <nav class="DefaultLayout-nav">
      <div class="DefaultLayout-langSelector">
        <FontAwesomeIcon icon="language" />
        Language
      </div>
    </nav>
    <slot/>
    <footer>
      Powered by Machine Learning(TM)
    </footer>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'LayoutDefault',

  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped lang="postcss">
/** @define DefaultLayout */
.DefaultLayout {
  display: flex;
  flex-flow: column nowrap;
}

.DefaultLayout-nav {
  background-color: config('colors.black');
  height: 3rem;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

.DefaultLayout-langSelector {
  color: white;
  align-self: center;

  padding-right: 1rem;
}

</style>
