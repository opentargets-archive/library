<template>
  <q-layout>
    <masthead slot="header"></masthead>
    <div id="searchbox" class="layout-view">
      <div>
        <searchbox class="layout-view"></searchbox>
      </div>
    </div>
    <mastfoot slot="footer"></mastfoot>
  </q-layout>
</template>

<script>
  import Masthead from './components/Masthead.vue';
  import Mastfoot from './components/Mastfoot.vue';
  import Searchbox from './components/Searchbox.vue';

  export default {
    name: 'app',
    components: {
      masthead: Masthead,
      mastfoot: Mastfoot,
      searchbox: Searchbox,
    },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #searchbox {
    width:100%;
  }
</style>
