<template>
  <div> <!-- root -->

    <!-- Established trends -->
    <i id=trends-spinner  class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>

    <div class="not-found-message" v-show="establishedTrends.length + novelTrends.length + negativeTrends.length === 0">No trends found</div>

    <div class="row gutter wrap justify-stretch content-center text-center">

      <div v-show="establishedTrends.length" class="width-1of3">
        <span class="trend-category-title">Established trends</span>
        <div @click="setTrend(trend)" class="trend-block" v-for="(trend, index) in establishedTrends">
          <div class="card-container">
            <trend-timeline :trend="trend" :height="height" :width="width" last="true">
            </trend-timeline>
          </div>
        </div>
      </div>

      <!-- New trends -->
      <div v-show="novelTrends.length" class="width-1of3">
        <span class="trend-category-title">Novel trends</span>
        <div @click="setTrend(trend)" class="trend-block" v-for="(trend, index) in novelTrends">
          <div class="card-container">
            <trend-timeline :trend="trend" :height="height" :width="width" last="true">
            </trend-timeline>
            <!--:last="index==novelTrends.length-1"-->
          </div>
        </div>
      </div>

      <!-- Negative trends -->
      <div v-show="negativeTrends.length" class="width-1of3">
        <span class="trend-category-title">Negative trends</span>
        <div @click="setTrend(trend)" class="trend-block" v-for="(trend, index) in negativeTrends">
          <div class="card-container">
            <trend-timeline :trend="trend" :height="height" :width="width" last="true">
            </trend-timeline>
            <!--:last="index==novelTrends.length-1"-->
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import axios from 'axios';
  import lucene from '../services/lucene';
  import trendLine from './TrendTimeline.vue';
  import apiBaseUrl from '../services/api';

  export default {
    // props: ['query', 'width', 'height'],
    components: {
      'trend-timeline': trendLine,
    },
    data() {
      return {
        filterType: 'trend',
        establishedTrends: [],
        novelTrends: [],
        negativeTrends: [],
        height: 50,
        width: 200,
        centinel: 'default',
        loading: false,
      };
    },
    computed: {
      ...mapGetters('filters', {
        getAllFilters: 'getAllFilters',
      }),
      /* eslint no-bitwise: 0 */
      // trendLineWidth() {
      //   return ~~(this.width / 3);
      // },
    },
    methods: {
      getData() {
        // Remove previous trends
        if (this.$el) {
          this.$el.innerHtml = '';
        }
        this.establishedTrends = [];
        this.novelTrends = [];
        this.negativeTrends = [];

        // Show the spinner
        this.loading = true;

        const query = lucene.compose3(this.getAllFilters);

        const baseUrl = `${apiBaseUrl}trends?query=`;
        // const baseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/trends?query=';
        const apiUrl = `${baseUrl}${query}`;
        console.log(`query for trends... ${apiUrl}`);
        axios.get(apiUrl)
          .then((resp) => {
            this.loading = false;
            // this.setTrends({
            //
            // })
            this.centinel = 'updated';
            this.establishedTrends = resp.data.established_trends.slice(0, 10);
            this.novelTrends = resp.data.novel_trends.slice(0, 10);
            this.negativeTrends = resp.data.negative_trends.slice(0, 10);
          });
      },
      setTrend(trend) {
        console.log('selecting trend... ', trend);
        this.addFilter({
          term: Object.keys(trend)[0],
          type: this.filterType,
        });

        // this.$emit('addFilter', {
        //   type: 'trend',
        //   term: Object.keys(trend)[0],
        // });
      },
      ...mapMutations('filters', [
        'addFilter',
      ]),
    },
    mounted() {
      this.width = ~~(this.$el.clientWidth / 3.2);
      this.getData();
    },
    watch: {
      // query() {
      getAllFilters() {
        this.getData();
      },
    },
  };
</script>

<style lang="scss">
  .not-found-message {
    margin: 10px;
  }
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
