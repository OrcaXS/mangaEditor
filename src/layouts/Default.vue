<template>
  <div class="DefaultLayout">
    <nav class="DefaultLayout-nav">
      <div class="DefaultLayout-langSelector">
        <FontAwesomeIcon icon="language" />
        <span v-t="{ path: 'misc.language' }" />
      </div>
    </nav>
    <slot/>
    <footer class="DefaultLayout-footer">
      <span v-t="{ path: 'misc.powered' }" />
    </footer>
  </div>
</template>

<script>
export default {
  name: 'LayoutDefault',

  components: {
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

.DefaultLayout-footer {
  text-align: center;
}

</style>
