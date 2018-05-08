<template>
  <div class="EditorLayout">
    <nav class="EditorLayout-topbar">
      <div class="EditorLayout-toolbar">
        <button
          v-for="icon in icons"
          :key="icon"
          class="EditorLayout-toolbarBtn"
        >
          <FontAwesomeIcon :icon="['fas', icon]" />
        </button>
      </div>
    </nav>
    <slot/>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'LayoutEditor',

  components: {
    FontAwesomeIcon,
  },

  data() {
    return {
      icons: [
        'save',
        'undo',
        'redo',
        'plus-square',
        'crop',
      ],
    };
  },

};
</script>

<style scoped lang="postcss">
/** @define EditorLayout */
.EditorLayout {
  display: flex;
  flex-flow: column nowrap;
}

.EditorLayout-topbar {
  background-color: config('colors.peach-mono-1');
  height: 3rem;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}

.EditorLayout-toolbar {
  align-self: center;

  padding-right: 1rem;
}

.EditorLayout-toolbarBtn {
  font-size: 1.125rem;
  color: white;
  padding: 1rem;

  cursor: default;

  &:hover {
    background-color: config('colors.peach');
  }
}

.EditorLayout-footer {
  text-align: center;
}

</style>
