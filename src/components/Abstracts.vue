<template>
  <div> <!-- root -->
    <div v-show="apiUrl.length" class="table-container">
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
    props: ['query'],
    watch: {
      query() {
        this.apiUrl = `${apiBaseUrl}?query=${this.query}`;
        // this.$refs.vuetable.refresh();
      },
    },
    methods: {
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
    >table {
      td {
        padding: 20px;
        vertical-align: top;
      }
      width:80%;
      margin-left: auto;
      margin-right: auto;
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
