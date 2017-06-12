<template>
  <div> <!-- root -->
    <div>
      <div class="responsive topic-card" v-show="topic.name">
        Topic: {{topic.name}}
      </div>
    </div>

    <div v-show="totalAbstracts" class="table-container">
      <div class="total-abstracts">
        Total abstracts: {{totalAbstracts}}
      </div>
      <vuetable ref="vuetable"
                :load-on-start="loadOnStart"
                :query-params="queryParams"
                :api-url="apiUrl"
                :fields="fields"
                :per-page= "perPage"
                data-path="hits.hits"
      ></vuetable>

      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check=false>
        <div v-show="moreToLoad" class="spinner-container">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
  import infiniteScroll from 'vue-infinite-scroll';
//  import MugenScroll from 'vue-mugen-scroll';
  import lucene from '../services/lucene';

  const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';

  export default {
    components: {
      Vuetable,
    },
    directives: {
      infiniteScroll,
    },
    computed: {
      apiUrl() {
        const query = lucene.compose2(this.query, this.topic, this.entities);
        let search = `query=${query}`;
        if (this.page) {
          search = `${search}&search_after=${this.page}`;
        }
//        return `${apiBaseUrl}?query=${query}`;
        const url = `${apiBaseUrl}?${search}`;
        console.log(`new url... ${url}`);
        return url;
      },
    },
    data() {
      return {
        loading: false,
        totalAbstracts: 0,
        perPage: 10,
        page: '',
        acc: [],
        moreToLoad: true,
        fields: [
          {
            name: '_source.authors',
            title: 'Authors',
            callback: this.authorsCbak,
          },
          {
            name: '_source.journal.medlineAbbreviation',
            title: 'Journal',
          },
          {
            name: '_source',
            title: 'Abstract',
            callback: this.abstractCbak,
          },
          {
            name: '_source.pub_date',
            title: 'Date',
          },
        ],
        loadOnStart: false,
        queryParams: {
          sort: 'sort',
          page: 'from', // it should be search_after, but only when it has to be present. So by default we keep it as 'from' which is ignored by the api
          perPage: 'size',
        },
      };
    },
    props: ['query', 'entities', 'topic'],
    methods: {
      transform(data) {
        /* eslint no-param-reassign: 0 */

        // get the number of records;
        // buffer the current entries in 'acc'
        this.acc = [...this.acc, ...data.hits.hits];
        data.hits.hits = this.acc;

        this.totalAbstracts = data.hits.total;

        // Show or hide the spinner depending on the number of abstracts to load
        if (this.totalAbstracts > this.acc.length) {
          this.moreToLoad = true;
        }
        else {
          this.moreToLoad = false;
        }

        return data;
      },

      // fetch data is here to work with the infinite scrolling (not working for now)
      loadMore() {
//        this.loading = true;
//        this.loading = false;

        if (this.moreToLoad) {
          this.page = this.acc[this.acc.length - 1].sort.join('-');
        }

        // this.$refs.vuetable.refresh();
        // this.$refs.vuetable.gotoPage(page);
      },

      abstractCbak(info) {
        const html = `<h6>${info.title}</h6><div>${info.abstract}</div>`;
        return html;
      },

      authorsCbak(authorsArr) {
        if (authorsArr.length === 1) {
          return authorsArr[0].full_name;
        }
        if (authorsArr.length === 2) {
          return `${authorsArr[0].full_name} and ${authorsArr[1].full_name}`;
        }
        return `${authorsArr[0].full_name} et al`;
      },
    },
  };

</script>

<style lang="scss">

  .spinner-container {
    width: 10%;
    margin-left: auto;
    margin-right: auto;
    font-size: 3em;
  }

  .table-container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 0.8em;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    >.total-abstracts {
      margin-left:20px;
    }

    > table {
      td {
        padding: 20px;
        vertical-align: top;
      }
      border-spacing: 0px 20px;
      .vuetable-th-_source\.authors {
        width: 10%;
      }
      .vuetable-th-_source\.journal {
        width: 10%;
      }
      .vuetable-th-_source\.abstract {
        width: 70%;
      }
      .vuetable-th-_source\.pub_date {
        width: 10%;
      }
    }
  }


</style>
