<template>
  <div> <!-- Root -->
    <publications-facets></publications-facets>
    <abstracts
      :filters="filters"
    ></abstracts>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import abstracts from './Abstracts.vue';
  import pubFacets from './PublicationsFacets.vue';
  import router from '../router';

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
    },
  };
</script>
