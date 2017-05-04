<template>
  <div> <!-- root -->
    <vuetable ref="vuetable"
              :load-on-start="loadOnStart"
              :query-parameters="queryParams"
              :api-url="apiUrl"
              :fields="fields"
              data-path="hits.hits"
    ></vuetable>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';

  // require('../../node_modules/vuetable-2/dist/vuetable-2.css'); // Not sure it is doing anything

  const apiBaseUrl = 'https://qkorhkwgf1.execute-api.eu-west-1.amazonaws.com/dev/search';
  export default {
    components: {
      Vuetable,
    },
    data() {
      return {
        apiUrl: '',
        fields: [
          {
            name: '_source.authors',
            title: 'Authors',
            callback: this.authorsCbak,
          },
          {
            name: '_source.abstract',
            title: 'Abstract',
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
        console.log('query has changed!!');
        console.log(this.$refs.vuetable);
        this.apiUrl = `${apiBaseUrl}?query=${this.query}`;
        // this.$refs.vuetable.refresh();
      },
    },
    methods: {
      authorsCbak(authorsArr) {
        console.log(authorsArr);
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

