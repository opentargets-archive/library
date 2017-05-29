<template>
  <div> <!-- root -->
    <div v-show="apiUrl.length" class="table-container">
      <div class="total-abstracts">
        Total abstracts: {{totalAbstracts}}
      </div>
      <vuetable ref="vuetable"
                :load-on-start="loadOnStart"
                :query-parameters="queryParams"
                :api-url="apiUrl"
                :fields="fields"
                data-path="hits.hits"
      ></vuetable>

      <!--<mugen-scroll :handler="fetchData" scroll-container="wrap">-->
      <!--loading...-->
      <!--</mugen-scroll>-->

    </div>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
  import MugenScroll from 'vue-mugen-scroll';
  import lucene from '../services/lucene';

  // import * as lucene from 'lucene';
  // import reduce from 'lodash';
  // import entitiesInfo from '../services/entities';

  // import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue';

  // require('../../node_modules/vuetable-2/dist/vuetable-2.css'); // Not sure it is doing anything

  const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';

  export default {
    components: {
      Vuetable,
      MugenScroll,
    },
    data() {
      return {
        loading: false,
        totalAbstracts: 0,
        apiUrl: '',
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
          page: 'from',
          perPage: 'size',
        },
      };
    },
    props: ['query', 'entities'],
    watch: {
      entities() {
        console.log('entities for abstract retrieving...');
        console.log(this.entities);
        const query = lucene.compose(this.query, this.entities);
        console.log(query);

        this.query = query;
      },
      query() {
        if (!this.query) {
          return;
        }

        this.apiUrl = `${apiBaseUrl}?query=${this.query}`;
        // this.$refs.vuetable.refresh();
      },
    },
    methods: {
      transform(data) {
        // get the number of records;
        console.log('abstract data...');
        console.log(data);
        this.totalAbstracts = data.hits.total;
        return data;
      },
      // fetch data is here to work with the infinite scrolling (not working for now)
      fetchData() {
        this.loading = true;
        console.log('time to fetch more data...');
        setTimeout(() => {
          this.loading = false;
        }, 2000);
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
