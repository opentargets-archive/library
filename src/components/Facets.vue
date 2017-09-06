<template>
  <div class="facets-container">
    <div class="row gutter wrap justify-stretch content-center text-center">
      <!-- Treemap -->
      <div class="width-2of3">
        <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>
        <treemap :width="width" :height="height" :chunks="topChunks" :loading="loading"></treemap>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import treemap from './Treemap.vue';
  import trends from './Trends.vue';

  export default {
    name: 'facets',
    props: ['width', 'height', 'query'],
    components: {
      treemap,
      trends,
    },
    data() {
      return {
        topChunks: [],
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
            this.topChunks = resp.data.aggregations.top_chunks_significant_terms.buckets;
            this.dataHistogram = resp.data.aggregations.pub_date_histogram.buckets;
          });
      },
    },
  };
</script>

<style lang="scss">
  .facets-container {
    margin-top: 20px;
    margin-left: 30px;
  }
</style>
