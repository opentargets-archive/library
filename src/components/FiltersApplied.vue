<template>
  <div> <!-- Root -->
    <div class="filters-container">
      <filter-pill
        v-for="(filter, index) in filters"
        :key="index"
        :filter="filter"
      >
      <!--@removeFilter="removeFilter"-->
      </filter-pill>
    </div>
  </div>
</template>
<script>
  // import { mapGetters, mapMutations } from 'vuex';
  import { mapGetters } from 'vuex';
  // import * as filters from '../services/filters';
  import FilterPill from './FilterPill.vue';
  // import eventHub from '../services/eventHub';

  export default {
    name: 'applied-filters',
    components: {
      'filter-pill': FilterPill,
    },
    data() {
      return {
        filters: [],
      };
    },
//    mounted() {
//      this.addFilter({
//        term: 'blah',
//        type: 'date',
//      });
//      this.addFilter({
//        term: 'blah2',
//        type: 'topic',
//      });
//
//      this.filters = this.getAllFilters;
//    },
    watch: {
      getAllFilters() {
        console.log('in filters applied, all filters have changed');
        console.log(this.getAllFilters);
        this.filters = this.getAllFilters;
      },
    },
    methods: {
      // addFilterToSearch(who) {
        // relay, why it is not propagated up?
        // this.$emit('addFilterToSearch', who);
      // },
//      removeFilter(who) {
//        filters.remove(who);
//        this.filters = filters.getAll();
//        this.$emit('removeFilter', who);
//      },
//       setFilterAsQuery(who) {
//         this.$emit('setFilterAsQuery', who);
//       },
//       ...mapMutations('filters', [
//         'addFilter',
//       ]),
    },
    computed: {
      ...mapGetters('filters', [
        'getAllFilters',
      ]),
    },
  };
</script>

<style lang="scss">
  .filters-container {
    margin-top: 20px;
    margin-left: 20px;
    margin-bottom: 5px;
  }
</style>
