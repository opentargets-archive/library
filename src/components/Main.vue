<template>
  <div> <!-- Root -->

    <!-- Search container -->
    <div class="search-container" @keyup.enter="doSearch">

      <div class="search-bar">
        <q-search v-model="inputQuery" icon='' class="primary blue" :debounce=10></q-search>
      </div>

      <div class="search-button" @click="doSearch">
        <i class="fa fa-search"></i>
      </div>
    </div>

    <div class="main-container">
      <!-- grid -->
      <div class="row gutter wrap justify-stretch">

        <div class="width-1of2 filters-panel">  <!-- left panel -->
          <filters
            :width="width"
            :height="height"
            @addFilter="addFilter"
            @removeFilterPill="removeFilterPill"
            :query="searchQuery"
            :removedFilter="removedFilter"
          ></filters>
        </div> <!-- /left panel -->

        <div class="width-1of2"> <!-- right panel -->
          <abstracts
            @addFilterToSearch="addSearchTerm"
            @removeFilter="removeFilter"
            @setFilterAsQuery="setFilterAsQuery"
            :query="searchQuery"
            :filters="filters"
          ></abstracts>
        </div> <!-- /right panel -->

      </div> <!-- /grid -->
    </div>
  </div>
</template>

<script type="text/javascript">
  import abstracts from './Abstracts.vue';
  import filters from './Filters.vue';
  import entityCard from './EntityCard.vue';
  import lucene from '../services/lucene';

  export default {
    name: 'main',
    data() {
      return {
        removedFilter: '',
        filters: [],
        height: '',
        width: '',
        inputQuery: '',
        searchQuery: '',
      };
    },
    components: {
      abstracts,
      'entity-card': entityCard,
      filters,
    },
    mounted() {
      const container = this.$el.querySelector('.filters-panel');
      this.width = container.offsetWidth;
      this.height = window.innerHeight - 100;
    },
    methods: {
      removeFilterPill(who) {
        this.filters = this.filters.filter((d) => d.term !== who.term);
      },
      removeFilter(who) {
        // this.filters = this.filters.filter((d) => d.term !== who.term);
        this.removeFilterPill(who);
        this.removedFilter = who;
      },
      addFilter(who) {
        this.filters.push(who);
      },
      addSearchTerm(who) {
        const query = lucene.compose(this.searchQuery, [who]);
        this.inputQuery = query;
        // this.filters = [];
        this.doSearch();
      },
      setFilterAsQuery(who) {
        this.inputQuery = who.luceneQuery;
        // this.filters = [];
        this.doSearch();
      },
      doSearch() {
        this.filters = [];
        this.searchQuery = this.inputQuery;
      },
    },
  };
</script>

<style lang="scss">
  .main-container {
    position: relative;
    margin-top: 10px;
  }

  .search-container {
    position: relative;
  }

  .search-button {
    font-size: 1.2em;
    display: inline-block;
    width: 50px;
    position: absolute;
    left: 12px;
    top: 7px;
    color: white;
    cursor: pointer;
  }

  .search-bar {
    display: inline-block;
    width: 100%;
  }

  .entity-card-container {
    min-width: 100px;
    width: 20%;
    position: absolute;
    right: 20px;
    border-width: 1px;
    border-color: #888888;
    border-style: solid;
    box-shadow: 5px 5px 2px #888888;
  }
</style>
