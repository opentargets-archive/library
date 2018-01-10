<template>
  <div> <!-- Root -->
    <publications-facets></publications-facets>
    <abstracts
      :filters="filters"
    ></abstracts>
    {{getAllFilters}}
    <!--@addFilterToSearch="addSearchTerm"-->
    <!--@removeFilter="removeFilter"-->
    <!--@setFilterAsQuery="setFilterAsQuery"-->

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import abstracts from './Abstracts.vue';
  import pubFacets from './PublicationsFacets.vue';
  import router from '../router';
  //  import * as filters from '../services/filters';
  //  import eventHub from '../services/eventHub';

  export default {
    components: {
      abstracts,
      'publications-facets': pubFacets,
    },
    data() {
      return {
        filters: [],
      };
    },
    computed: {
      ...mapGetters('filters', {
        getAllFilters: 'getAllFilters',
      }),
    },
    watch: {
      getAllFilters() {
        if (!this.getAllFilters.length) {
          router.push({
            path: '/',
            query: '',
          });
        }
        else {
          this.filters = this.getAllFilters;
        }
      },
    },
    mounted() {
      this.filters = this.getAllFilters;
//      console.log(this.$store.getters['filters/getAllFilters']);
      // this.query = this.$route.query.query;
//      eventHub.$on('query', (query) => {
//        console.log(`new query... in publications: ${query}`);
//        this.query = query;
//      });

      // Set initial set of filters...
//      this.filters = filters.getAll();

      // Listen to changes in the filters...
//      eventHub.$on('filters', (fts) => {
//        this.filters = fts;
//      });
    },
  };
</script>
