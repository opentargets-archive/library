<template>
  <q-layout>
    <masthead slot="header"></masthead>

    <div id="searchbox" class="layout-view" ref="wrap">
      <div>
        <searchbox></searchbox>
      </div>
    </div>
    <mastfoot slot="footer"></mastfoot>
  </q-layout>
</template>

<script>
  import Masthead from './components/Masthead.vue';
  import Mastfoot from './components/Mastfoot.vue';
  import Main from './components/Main.vue';

  export default {
    name: 'app',
    components: {
      masthead: Masthead,
      mastfoot: Mastfoot,
      searchbox: Main,
    },
  };
</script>

<style lang="scss">
  #searchbox {
    width:100%;
  }

  .version {
    font-size: 0.7em;
  }

</style>
