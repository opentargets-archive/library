<template>
  <div> <!-- Root -->
    <div @keyup.enter="doSearch">
      <q-search v-model="inputQuery" class="primary blue"></q-search>
    </div>

    <!-- Add new entities -->
    <entities-menu @fields="setFields"></entities-menu>

    <!-- Display the results -->
    <div>
      <p class="tip" v-if="searchQuery">Graph for <b>{{searchQuery}}</b></p>
      <div id="graphContainer"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
  // import * as d3 from 'd3';
  import otSearch from 'ots-graph';
  import entitiesMenu from './EntitiesMenu.vue';

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
    },
    methods: {
      setFields(data, colors) {
        console.log('these are the fields to pass to the query...');
        console.log(data);
        const scope = this;
        data.forEach((d) => {
          scope.colors[d.field] = colors[d.field];
        });
        scope.fields = data;
      },
      doSearch() {
        // let's try to have the size of the container...
        const width = document.getElementById('graphContainer').offsetWidth;
        const height = window.innerHeight - 150;

        const vueCtx = this;

        console.log('we are going to use these fields in the query...');
        console.log(vueCtx.fields);

        // Remove any previous instance of the graph
        const graphContainer = document.getElementById('graphContainer');
        graphContainer.innerHTML = '';

        const graph = otSearch()
          .width(width)
          .height(height)
          .query(vueCtx.inputQuery)
          .fields(vueCtx.fields)
          .colors(vueCtx.colors);
        graph(document.getElementById('graphContainer'));

        this.searchQuery = this.inputQuery;
      },
    },
  };
</script>

<style>
  .tip {
    position:absolute;
    right:10px;
  }
</style>
