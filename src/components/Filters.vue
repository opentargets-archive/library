<template>
  <div v-show="query"> <!-- Root -->

    <!-- Filters tabs -->
    <q-tabs
      slot="navigation"
      :refs="$refs"
      default-tab="treemap"
    >

      <q-tab class="filter-label" name="treemap" :style="{background: colors.term}" icon="view_quilt">Terms</q-tab>
      <q-tab class="filter-label" name="dates" :style="{background: colors.date}" icon="date_range">Date range</q-tab>
      <q-tab class="filter-label" name="trends" :style="{background: colors.trend}" icon="trending_up">Trends</q-tab>
      <q-tab class="filter-label" name="graph" :style="{background: colors.topic}" icon="border_outer">Topics</q-tab>
    </q-tabs>


    <!-- treemap tab -->
    <div class="filter-tab" ref="treemap">
      <div>
        <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>
        <treemap @addFilter="newFilter" :width="width" :height="height" :aggs="aggs" :loading="loading"></treemap>
        <!--<facets :width="width" :height="height" :query="query"></facets>-->
      </div>
    </div>

    <!-- dates tab -->
    <div class="filter-tab" ref="dates">
      <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>
      <date-range @addFilter="newFilter" :data="dateHistogram" :width="width" :loading="loading"></date-range>
    </div>

    <!-- trends tab -->
    <div class="filter-tab" ref="trends">
      <trends @addFilter="newFilter" :query="query" :width="width" :height="height"></trends>
    </div>

    <!-- Graph is now a tab... -->
    <div class="filter-tab" ref="graph">
      <!-- Add new entities -->
      <!--<entities-menu @fields="setFields"></entities-menu>-->

      <!-- Graph -->
      <results-graph
        @addFilter="newFilter"
        @removeFilter="removeFilter"
        :width="width"
        :height="height"
        :query="query"
        :removedFilter="removedFilter"
      ></results-graph>
        <!--@selected="updateVertexSelection"-->
        <!--@selectedTopic="updateTopic"-->
        <!--:fields="fields"-->
        <!--:colors="colors"-->
        <!--:unselect="unselect"-->
    </div>

  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import treemap from './Treemap.vue';
  import dateRange from './Daterange.vue';
  import trends from './Trends.vue';
  import resultsGraph from './resultsGraph.vue';
  import pillColors from '../services/pillColors';


  export default {
    name: 'filters',
    props: ['width', 'height', 'query', 'removedFilter'],
    components: {
      treemap,
      'date-range': dateRange,
      trends,
      'results-graph': resultsGraph,
    },
    data() {
      return {
        colors: pillColors,
        aggs: {},
        dateHistogram: [],
        loading: false,
      };
    },
    computed: {
      apiUrl() {
        const apiBaseUrl = 'https://vy36p7a9ld.execute-api.eu-west-1.amazonaws.com/dev/search';
        return `${apiBaseUrl}?query=${this.query}&aggs=true&size=0`;
      },
    },
    watch: {
      apiUrl() {
        this.loading = true;
        axios.get(this.apiUrl)
          .then((resp) => {
            this.loading = false;
            // this.topChunks = resp.data.aggregations.top_chunks_significant_terms.buckets;
            this.aggs = {
              terms: resp.data.aggregations.top_chunks_significant_terms.buckets,
              genes: resp.data.aggregations.genes.buckets,
              diseases: resp.data.aggregations.diseases.buckets,
              phenotypes: resp.data.aggregations.phenotypes.buckets,
              drugs: resp.data.aggregations.drugs.buckets,
              journals: resp.data.aggregations.journal_abbr_significant_terms.buckets,
              authors: resp.data.aggregations.authors_significant_terms.buckets,
            };
            this.dateHistogram = resp.data.aggregations.pub_date_histogram.buckets;
          });
      },
    },
    methods: {
      newFilter(who) {
        this.$emit('addFilter', who);
      },
      removeFilter(who) {
        this.$emit('removeFilterPill', who);
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
    },
  };
</script>

<style lang="scss">
  .filter-tab {
    margin-left: 20px;
    margin-right: 20px;
    margin-top:10px;
  }
  .filter-label {
    color: black;
  }
</style>
