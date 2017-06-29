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

      <div v-show="!searchQuery" class="salute vertical-middle">
        <h5>Welcome to Open Targets | Library</h5>
        <div class="subheader">This site allows to mine all the Pubmed articles in real time.</div>
        <div>Some tips:</div>
        <div>
          <ul>
            <li class="tip">You can search for multiple terms joining them with <span class="keyword">AND</span>, for example: <span class="keyword">BRAF AND melanoma</span></li>
            <li class="tip">If a term has more than one word, use quotes. For example: <span class="keyword">"Alzheimer disease"</span></li>
            <li class="tip">Use quotes as well if the term has non alpha-numerical values. For example: <span class="keyword">"K-RAS"</span></li>
          </ul>
        </div>
        <div>
          This site is currently under development.
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
  import abstracts from './Abstracts.vue';
  import filters from './Filters.vue';
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
