<template>
  <div> <!-- Root -->

    <!-- Search container -->
    <div class="search-container" @keyup.enter="doSearch">
      <div class="search-bar">
        <q-search v-model="inputQuery" icon='' class="primary blue" :debounce=10></q-search>
      </div>

      <div class="search-button" @click="doSearch">
        <i class="fa fa-search"></i>
      </div>
    </div>

    <div class="main-container">
      <!-- grid -->
      <div class="row gutter wrap justify-stretch">

        <!-- left panel -->
        <div class="width-1of2 filters-panel">

          <filters :width="width" :height="height" :query="searchQuery"></filters>

          <!--<q-tabs-->
            <!--slot="navigation"-->
            <!--:refs="$refs"-->
            <!--default-tab="treemap"-->
          <!--&gt;-->

            <!--<q-tab name="treemap" icon="border_outer">Terms</q-tab>-->
            <!--<q-tab name="dates" icon="date_range">Date range</q-tab>-->
            <!--<q-tab name="trends" icon="trending_up">Trends</q-tab>-->
            <!--<q-tab name="graph" icon="timeline">Graph</q-tab>-->
          <!--</q-tabs>-->


          <!--&lt;!&ndash; treemap tab &ndash;&gt;-->
          <!--<div ref="treemap">-->
            <!--<div>-->
              <!--<facets :width="width" :height="height" :query="searchQuery"></facets>-->
            <!--</div>-->
          <!--</div>-->

          <!--&lt;!&ndash; dates tab &ndash;&gt;-->
          <!--<div ref="dates">-->
            <!--Date range picker here-->
          <!--</div>-->

          <!--&lt;!&ndash; trends tab &ndash;&gt;-->
          <!--<div ref="trends">-->
            <!--<trends :query="query"></trends>-->
          <!--</div>-->

          <!--&lt;!&ndash; Graph is now a tab... &ndash;&gt;-->
          <!--<div ref="graph">-->
            <!--&lt;!&ndash; Add new entities &ndash;&gt;-->
            <!--<entities-menu @fields="setFields"></entities-menu>-->

            <!--&lt;!&ndash; Graph &ndash;&gt;-->
            <!--<results-graph-->
              <!--@selected="updateVertexSelection"-->
              <!--@selectedTopic="updateTopic"-->
              <!--:width="width"-->
              <!--:height="height"-->
              <!--:query="searchQuery"-->
              <!--:fields="fields"-->
              <!--:colors="colors"-->
              <!--:unselect="unselect"-->
            <!--&gt;</results-graph>-->
          <!--</div>-->

          <!--&lt;!&ndash; Card container showing clicked entities &ndash;&gt;-->
          <!--<div>-->
            <!--&lt;!&ndash;<q-transition name="slide">&ndash;&gt;-->
            <!--<div class="responsive entity-card-container" v-show="selectedEntities.length">-->
              <!--<div v-for="entity in selectedEntities">-->
                <!--<entity-card-->
                  <!--@removeEntity="removeSelection"-->
                  <!--@addSearchTerm="addSearchTerm"-->
                  <!--:entity="entity"-->
                  <!--:colors="colors"-->
                <!--&gt;</entity-card>-->
              <!--</div>-->
            <!--</div>-->
            <!--&lt;!&ndash;</q-transition>&ndash;&gt;-->
          <!--</div>-->

        </div> <!-- /left panel -->

        <div class="width-1of2"> <!-- right panel -->
          <!-- Abstracts table -->
          <abstracts :query="searchQuery" :topic="selectedTopic" :entities="selectedEntities"></abstracts>
        </div> <!-- /right panel -->

      </div> <!-- /grid -->
    </div>
  </div>
</template>

<script type="text/javascript">
  // import entitiesMenu from './EntitiesMenu.vue';
  import abstracts from './Abstracts.vue';
  // import resultsGraph from './resultsGraph.vue';
  // import facets from './Facets.vue';
  import filters from './Filters.vue';
  import entityCard from './EntityCard.vue';
  import lucene from '../services/lucene';

  export default {
    name: 'main',
    data() {
      return {
        // colors: {},
        // currFields: {},
        // fields: {},
        height: '',
        width: '',
        inputQuery: '',
        searchQuery: '',
        selectedEntities: [],
        selectedTopic: {},
        // unselect: [],
      };
    },
    components: {
      // 'entities-menu': entitiesMenu,
      abstracts,
      // 'results-graph': resultsGraph,
      'entity-card': entityCard,
      // facets,
      filters,
    },
    mounted() {
      const container = this.$el.querySelector('.filters-panel');
      this.width = container.offsetWidth;
      // this.height = container.offsetHeight;
      this.height = window.innerHeight - 100;
    },
    methods: {
      removeSelection(who) {
        this.unselect = [who];
      },
      addSearchTerm(who) {
        const query = lucene.compose(this.searchQuery, [who]);
        this.inputQuery = query;
        this.unselect = this.selectedEntities;
        this.selectedEntities = [];
        this.doSearch();
      },
//      updateTopic(topic) {
//        if (topic) {
//          this.selectedTopic = topic;
//        }
//        else {
//          this.selectedTopic = undefined;
//        }
//      },
//      updateVertexSelection(selected) {
//        this.selectedEntities = selected;
//      },
//      setFields(data, colors) {
//        const vueCtx = this;
//        data.forEach((d) => {
//          vueCtx.colors[d.field] = colors[d.field];
//        });
//        vueCtx.currFields = data;
//      },
      doSearch() {
        this.searchQuery = this.inputQuery;
        // this.fields = this.currFields;
      },
    },
  };
</script>

<style lang="scss">
  .main-container {
    position: relative;
    margin-top: 10px;
  }

  .search-container {
    position: relative;
  }

  .search-button {
    font-size: 1.2em;
    display: inline-block;
    width: 50px;
    position: absolute;
    left: 12px;
    top: 7px;
    color: white;
    cursor: pointer;
  }

  .search-bar {
    display: inline-block;
    width: 100%;
  }

  .entity-card-container {
    min-width: 100px;
    width: 20%;
    position: absolute;
    right: 20px;
    border-width: 1px;
    border-color: #888888;
    border-style: solid;
    box-shadow: 5px 5px 2px #888888;
  }
</style>
