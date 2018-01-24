<template>
  <div> <!-- Root -->

    <!-- Search container -->
    <div class="search-container" @keyup.enter="doSearch">
      <div :style='{"width": searchWidth + "px"}' class="search-bar floating-label">
        <input v-model="inputQuery" required class="full-width">
        <label>Search for a term</label>
      </div>

      <button class="primary" @click="doSearch">Search</button>
      <button class="secondary" @click="discardSearch">Reset</button>

      <div class="search-button first">
        <i class="fa fa-search"></i>
      </div>
    </div>

    <div class="main-container">
    </div>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters, mapMutations } from 'vuex';
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
      };
    },
    computed: {
      searchWidth() {
        const w = (this.inputQuery.length * 7.5);
        if (w < 150) {
          return 150;
        }
        if (w > (window.innerWidth - 250)) {
          return (window.innerWidth - 250);
        }
        return w;
      },
      ...mapGetters('filters', [
        'getAllFilters',
      ]),
    },
    mounted() {
      // Set the container dimensions
      // TODO: This needs to be responsive
      // const container = this.$el.querySelector('.filters-panel');
      const container = this.$el;
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
        this.doSearch();
      },
      setFilterAsQuery(who) {
        this.inputQuery = who.luceneQuery;
        this.doSearch();
      },
      clickHandler() {
        // Changing the Vuex store...
        this.removeAllFilters();
        this.addFilter({
          term: this.inputQuery,
          type: 'query',
        });
      },
      doSearch() {
        this.clickHandler();
      },
      discardSearch() {
        // Changing the Vuex store...
        this.inputQuery = '';
        this.removeAllFilters();
      },
      ...mapMutations('filters', [
        'addFilter',
        'removeAllFilters',
      ]),
    },
  };
</script>

<style lang="scss">
  .main-container {
    // position: relative;
    margin-top: 10px;
  }

  .search-container {
    position: relative;
    margin-top: 5px;
  }

  .search-button {
    font-size: 1.2em;
    display: inline-block;
    // width: 50px;
    position: absolute;
    top: 25px;
    color: #a3a3a3;
    //cursor: pointer;
    &.first {
      left: 32px;
    }
    &.second {
      left: 35px;
    }
  }

  .search-bar {
    display: inline-block;
    min-width: 150px;
    // width: 100%;
    margin-left: 60px;
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

  .card-container {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    /*box-shadow: 10px 10px 5px #888888;*/
    /*-webkit-box-shadow: 10px 10px 5px #888888;*/
    /*-moz--webkit-box-shadow: 10px 10px 5px #888888;*/
    border: 1px #888888;
    border-style: solid;
    background: #ffffff;
  }

  .salute {
    width: 30%;
    margin: auto;
    border: 1px solid #dddddd;
    padding: 15px;
    margin-top: 50px;
    .keyword {
      font-size: 0.9em;
      background: #f4f4f4;
      color: steelblue;
      padding: 2px;
    }
    .subheader {
      margin-bottom: 10px;
    }
    .tip {
      margin-bottom: 10px;
    }
  }
</style>
