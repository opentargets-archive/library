<template>
  <div> <!-- Root -->

    <!-- Filters tabs -->
    <q-tabs
      slot="navigation"
      :refs="$refs"
      default-tab="treemap"
    >

      <q-tab name="treemap" icon="border_outer">Terms</q-tab>
      <q-tab name="dates" icon="date_range">Date range</q-tab>
      <q-tab name="trends" icon="trending_up">Trends</q-tab>
      <q-tab name="graph" icon="timeline">Topics</q-tab>
    </q-tabs>


    <!-- treemap tab -->
    <div class="filter-tab" ref="treemap">
      <div>
        <treemap :width="width" :height="height" :chunks="topChunks" :loading="loading"></treemap>
        <!--<facets :width="width" :height="height" :query="query"></facets>-->
      </div>
    </div>

    <!-- dates tab -->
    <div class="filter-tab" ref="dates">
      <date-range :data="dateHistogram" :width="width"></date-range>
    </div>

    <!-- trends tab -->
    <div class="filter-tab" ref="trends">
      <trends :query="query" :width="width" :height="height"></trends>
    </div>

    <!-- Graph is now a tab... -->
    <div class="filter-tab" ref="graph">
      <!-- Add new entities -->
      <!--<entities-menu @fields="setFields"></entities-menu>-->

      <!-- Graph -->
      <results-graph
        @selected="updateVertexSelection"
        @selectedTopic="updateTopic"
        :width="width"
        :height="height"
        :query="query"
      ></results-graph>
        <!--:fields="fields"-->
        <!--:colors="colors"-->
        <!--:unselect="unselect"-->
    </div>

    <!-- Card container showing clicked entities -->
    <!--<div>-->
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
    <!--</div>-->

  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import treemap from './Treemap.vue';
  import dateRange from './Daterange.vue';
  import trends from './Trends.vue';
  import resultsGraph from './resultsGraph.vue';

  export default {
    name: 'filters',
    props: ['width', 'height', 'query'],
    components: {
      treemap,
      'date-range': dateRange,
      trends,
      'results-graph': resultsGraph,
    },
    data() {
      return {
        topChunks: [],
        dateHistogram: [],
        loading: false,
      };
    },
    computed: {
      apiUrl() {
        const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';
        return `${apiBaseUrl}?query=${this.query}&aggs=true&size=0`;
      },
    },
    watch: {
      width() {
        console.log(`in filters width is ${this.width}`);
      },
      apiUrl() {
        this.loading = true;
        axios.get(this.apiUrl)
          .then((resp) => {
            this.loading = false;
            this.topChunks = resp.data.aggregations.top_chunks_significant_terms.buckets;
            this.dateHistogram = resp.data.aggregations.pub_date_histogram.buckets;
          });
      },
    },
    methods: {
      updateTopic(topic) {
        if (topic) {
          this.selectedTopic = topic;
        }
        else {
          this.selectedTopic = undefined;
        }
      },
      updateVertexSelection(selected) {
        this.selectedEntities = selected;
      },
    },
  };
</script>

<style lang="scss">
  .filter-tab {
    margin-left: 20px;
    margin-right: 20px;
    margin-top:10px;
  }
</style>
