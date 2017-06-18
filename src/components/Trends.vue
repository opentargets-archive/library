<template>
  <div> <!-- root -->

    <!-- Established trends -->
    <i id=trends-spinner  class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>

    <div class="row gutter wrap justify-stretch content-center text-center">

      <div v-show="establishedTrends.length" class="width-1of2">
        <span class="trend-category-title">Established trends</span>
        <div @click="selectTrend(trend)" class="trend-block" v-for="(trend, index) in establishedTrends">
          <trend-timeline :width="trendLineWidth" :height="height" :trend="trend" :last="index==establishedTrends.length-1"></trend-timeline>
        </div>
      </div>

      <!-- New trends -->
      <div v-show="novelTrends.length" class="width-1of2">
        <span class="trend-category-title">Novel trends</span>
        <div @click="selectTrend(trend)" class="trend-block" v-for="(trend, index) in novelTrends">
          <trend-timeline :width="trendLineWidth" :height="height" :trend="trend" :last="index==novelTrends.length-1"></trend-timeline>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import trendLine from './TrendTimeline.vue';

  export default {
    props: ['query', 'width', 'height'],
    components: {
      'trend-timeline': trendLine,
    },
    data() {
      return {
        establishedTrends: [],
        novelTrends: [],
        loading: false,
      };
    },
    computed: {
      /* eslint no-bitwise: 0 */
      trendLineWidth() {
        return ~~(this.width / 3) - 30;
      },
    },
    methods: {
      selectTrend(trend) {
        this.$emit('addFilter', {
          type: 'trend',
          term: Object.keys(trend)[0],
        });
      },
    },
    watch: {
      query() {
        // Remove previous trends
        if (this.$el) {
          this.$el.innerHtml = '';
        }
        this.establishedTrends = [];
        this.novelTrends = [];

        // Show the spinner
        this.loading = true;

        const baseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/trends?query=';
        const apiUrl = `${baseUrl}"${this.query}"`;
        axios.get(apiUrl)
          .then((resp) => {
            this.loading = false;
            this.establishedTrends = resp.data.established_trends.slice(0, 10);
            this.novelTrends = resp.data.novel_trends.slice(0, 10);
          });
      },
    },
  };
</script>

<style lang="scss">
  .trend-block {
    margin-bottom: 10px;
  }
  .trend-category-title {
    display: inline-block;
    margin-bottom: 20px;
  }
  #trends-spinner {
    margin-top: 20px;
  }
</style>
