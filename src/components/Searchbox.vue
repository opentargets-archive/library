<template>
  <div> <!-- Root -->
    <div @keyup.enter="doSearch">
      <q-search v-model="inputQuery" class="primary blue"></q-search>
    </div>

    <div class="main-container">
      <!-- Add new entities -->
      <entities-menu @fields="setFields"></entities-menu>

      <!-- Graph -->
      <results-graph :query="searchQuery" :fields="fields" :colors="colors"></results-graph>

      <!-- Abstracts table -->
      <abstracts :query="searchQuery"></abstracts>

    </div>

  </div>
</template>

<script type="text/javascript">
  // import * as d3 from 'd3';
  import entitiesMenu from './EntitiesMenu.vue';
  import abstracts from './Abstracts.vue';
  import resultsGraph from './resultsGraph.vue';

  export default {
    name: 'searchbox',
    data() {
      return {
        inputQuery: '',
        searchQuery: '',
        fields: {},
        colors: {},
      };
    },
    components: {
      'entities-menu': entitiesMenu,
      abstracts,
      'results-graph': resultsGraph,
    },
    methods: {
      setFields(data, colors) {
        const vueCtx = this;
        data.forEach((d) => {
          vueCtx.colors[d.field] = colors[d.field];
        });
        vueCtx.fields = data;
      },
      doSearch() {
        this.searchQuery = this.inputQuery;
      },
    },
  };
</script>

<style>
  .main-container {
    position:relative;
  }
</style>
