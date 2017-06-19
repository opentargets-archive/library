<template>
  <div> <!-- root -->

    <div class="filters-container">
      <filter-pill
        v-for="(filter, index) in filters"
        :key="index"
        :filter="filter"
        @removeFilter="removeFilter"
        @addFilterToSearch="addFilterToSearch"
        @setFilterAsQuery="setFilterAsQuery"
      >
      </filter-pill>
    </div>

    <i class="fa fa-2x fa-spinner fa-spin" v-show="loading"></i>

    <div v-show="totalAbstracts==0 && !loading" class="total-abstracts">
      There are no abstracts matching your query and filters
    </div>

    <div v-show="acc.length" class="table-container">
      <div class="total-abstracts">
        Showing {{acc.length}} abstracts of {{totalAbstracts}} matching your query and filters
      </div>

      <div class="abstract-card" v-for="abstract in acc">
        <abstract-card :abstract="abstract"></abstract-card>
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
  import infiniteScroll from 'vue-infinite-scroll';
  import AbstractCard from './AbstractCard.vue';
  import FilterPill from './FilterPill.vue';
  import lucene from '../services/lucene';


  const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';

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
        const query = lucene.compose3(this.query, this.filters);
        let search = `query=${query}`;
        if (this.lastAbstract) {
          search = `${search}&search_after=${this.lastAbstract.sort[0]}&search_after_id=${this.lastAbstract._id}`;
        }
        const url = `${apiBaseUrl}?${search}`;
        console.log(`new url... ${url}`);
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
    props: ['query', 'filters'],
    watch: {
      filters() {
        this.acc = [];
        this.lastAbstract = '';
      },
      query() {
        this.acc = [];
        this.lastAbstract = '';
      },
      apiUrl() {
        this.loading = true;
        const apiUrl = this.apiUrl.split('#-#')[0];
        axios.get(apiUrl)
          .then((resp) => {
            this.loading = false;
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
      addFilterToSearch(who) {
        // relay, why it is not propagated up?
        this.$emit('addFilterToSearch', who);
      },
      removeFilter(who) {
        this.$emit('removeFilter', who);
      },
      setFilterAsQuery(who) {
        this.$emit('setFilterAsQuery', who);
      },

      // fetch data is here to work with the infinite scrolling (not working for now)
      loadMore() {
        this.lastAbstract = this.acc[this.acc.length - 1];
      },

    },
  };

</script>

<style lang="scss">

  .spinner-container {
    width: 10%;
    margin-left: auto;
    margin-right: auto;
    font-size: 2em;
  }

  .abstract-card {
    margin-top: 30px;
  }

  .total-abstracts {
    font-size: 0.7em;
  }

  .filters-container {
    margin-bottom: 5px;
  }

</style>
