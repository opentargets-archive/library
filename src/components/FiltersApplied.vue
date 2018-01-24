<template>
  <div> <!-- Root -->
    <div class="filters-container">
      <filter-pill
        v-for="(filter, index) in filters"
        :key="index"
        :filter="filter"
      >
      </filter-pill>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import FilterPill from './FilterPill.vue';

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
    watch: {
      getAllFilters() {
        this.filters = this.getAllFilters;
      },
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
