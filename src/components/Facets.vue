<template>
  <div class="facets-container">
    <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>
    <treemap :width="width" :height="height" :chunks="topChunks" :loading="loading"></treemap>
  </div>
</template>

<script>
  import axios from 'axios';
  import treemap from './Treemap.vue';

  export default {
    name: 'facets',
    props: ['width', 'height', 'query'],
    components: {
      treemap,
    },
    data() {
      return {
        topChunks: [],
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
      apiUrl() {
        console.log(this.apiUrl);
        this.loading = true;
        axios.get(this.apiUrl)
          .then((resp) => {
            console.log(resp);
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
