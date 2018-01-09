<template>
  <div v-show="filters"> <!-- root -->

    <!--<div class="filters-container">-->
      <!--<filter-pill-->
        <!--v-for="(filter, index) in filters"-->
        <!--:key="index"-->
        <!--:filter="filter"-->
        <!--@removeFilter="removeFilter"-->
        <!--@addFilterToSearch="addFilterToSearch"-->
        <!--@setFilterAsQuery="setFilterAsQuery"-->
      <!--&gt;-->
      <!--</filter-pill>-->
    <!--</div>-->

    <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>

    <div v-show="totalAbstracts===0 && !loading" class="total-abstracts">
      There are no abstracts matching your query and filters
    </div>

    <div v-show="acc.length">
      <div class="total-abstracts">
        Showing {{acc.length}} abstracts of {{totalAbstracts}} matching your query and filters
      </div>

      <div class="abstracts-container">
        <div class="card-container" v-for="abstract in acc">
          <abstract-card
            @addFilter="addFilter"
            :abstract="abstract"
          ></abstract-card>
        </div>

      </div>

      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check=false>
        <div v-show="moreToLoad" class="spinner-container">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapMutations } from 'vuex';
  import infiniteScroll from 'vue-infinite-scroll';
  import AbstractCard from './AbstractCard.vue';
  import FilterPill from './FilterPill.vue';
  import lucene from '../services/lucene';
  import apiBaseUrl from '../services/api';


  // const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';
  // const apiBaseUrl = 'https://vy36p7a9ld.execute-api.eu-west-1.amazonaws.com/dev/search';

  export default {
    components: {
      'abstract-card': AbstractCard,
      'filter-pill': FilterPill,
    },
    directives: {
      infiniteScroll,
    },
    computed: {
      apiUrl() {
        /* eslint no-underscore-dangle: 0 */
        /* eslint no-unused-expressions: 0 */
        const query = lucene.compose3(this.filters);
        let search = `query=${query}`;
        if (this.lastAbstract) {
          search = `${search}&aggs=true&search_after=${this.lastAbstract.sort[0]}&search_after_id=${this.lastAbstract._id}`;
        }
        const url = `${apiBaseUrl}/search?aggs=true&${search}`;
        this.counter += 1;
        return `${url}#-#${this.counter}`;
      },
    },
    data() {
      return {
        abstracts: [],
        loading: false,
        totalAbstracts: -1, // to allow for 0 abstracts
        perPage: 10,
        lastAbstract: '',
        acc: [],
        counter: 0,
        moreToLoad: true,
        queryParams: {
          sort: 'sort',
          page: 'from', // it should be search_after, but only when it has to be present. So by default we keep it as 'from' which is ignored by the api
          perPage: 'size',
        },
      };
    },
    props: ['filters'],
    watch: {
      filters() {
        console.log('all filters in publications...');
        console.log(this.filters);
        this.acc = [];
        this.lastAbstract = '';
      },
//      query() {
//        this.acc = [];
//        this.lastAbstract = '';
//      },
      apiUrl() {
        this.loading = true;
        const apiUrl = this.apiUrl.split('#-#')[0];
        console.log(`apiUrl: ${apiUrl}`);
        axios.get(apiUrl)
          .then((resp) => {
            this.loading = false;
            // Add the aggregations to the Vuex store...
            this.setAggs(resp.data.aggregations);

            const data = resp.data.hits;
            this.abstracts = data.hits;
            this.acc = [...this.acc, ...this.abstracts];
            this.totalAbstracts = data.total;

            // Show or hide the spinner depending on the number of abstracts to load
            if (this.totalAbstracts > this.acc.length) {
              this.moreToLoad = true;
            }
            else {
              this.moreToLoad = false;
            }
          });
      },
    },
    methods: {
      addFilter(who) {
        this.filters.push(who);
      },
      // addFilterToSearch(who) {
      //   // relay, why it is not propagated up?
      //   this.$emit('addFilterToSearch', who);
      // },
      // removeFilter(who) {
      //   this.$emit('removeFilter', who);
      // },
      // setFilterAsQuery(who) {
      //   this.$emit('setFilterAsQuery', who);
      // },

      // fetch data is here to work with the infinite scrolling (not working for now)
      loadMore() {
        this.lastAbstract = this.acc[this.acc.length - 1];
      },
      ...mapMutations('aggs', [
        'setAggs',
      ]),
    },
  };

</script>

<style lang="scss">

  .abstracts-container {
    padding: 10px;
  }

  .spinner-container {
    width: 10%;
    margin-left: auto;
    margin-right: auto;
    font-size: 2em;
  }

  /*.abstract-card {*/
    /*margin-top: 20px;*/
    /*padding: 10px;*/
    /*padding: 10px;*/
    /*border-radius: 5px;*/
    /*box-shadow: 10px 10px 5px #888888;*/
    /*-webkit-box-shadow: 10px 10px 5px #888888;*/
    /*-moz--webkit-box-shadow: 10px 10px 5px #888888;*/
    /*border: 1px #888888;*/
    /*border-style: solid;*/
    /*background: #ffffff;*/
  /*}*/

  .total-abstracts {
    margin-left: 20px;
    font-size: 0.7em;
  }

  /*.filters-container {*/
    /*margin-top: 10px;*/
    /*margin-bottom: 5px;*/
  /*}*/

</style>
