<template>
  <div> <!-- Root -->
    <div class="search-container" @keyup.enter="doSearch">
      <div class="search-bar">
        <q-search v-model="inputQuery" icon='' class="primary blue" :debounce=10></q-search>
      </div>

      <div class="search-button" @click="doSearch">
        <i class="fa fa-search"></i>
      </div>


    </div>

    <div class="main-container">
      <!-- Add new entities -->
      <entities-menu @fields="setFields"></entities-menu>

      <!-- Card container showing clicked entities -->
      <div>
        <!--<q-transition name="slide">-->
          <div class="responsive entity-card-container" v-show="selectedEntities.length">
            <div v-for="entity in selectedEntities">
              <entity-card @removeEntity="removeSelection" @addSearchTerm="addSearchTerm" :entity="entity" :colors="colors"></entity-card>
            </div>
          </div>
        <!--</q-transition>-->
      </div>

      <!-- Graph -->
      <results-graph @selected="updateVertexSelection" :query="searchQuery" :fields="fields" :colors="colors" :unselect="unselect"></results-graph>

      <!-- Abstracts table -->
      <abstracts :query="searchQuery" :entities="selectedEntities"></abstracts>

    </div>

  </div>
</template>

<script type="text/javascript">
  // import * as d3 from 'd3';
  // import { remove } from 'lodash';
  import entitiesMenu from './EntitiesMenu.vue';
  import abstracts from './Abstracts.vue';
  import resultsGraph from './resultsGraph.vue';
  import entityCard from './entityCard.vue';
  import lucene from '../services/lucene';


  export default {
    name: 'searchbox',
    data() {
      return {
        inputQuery: '',
        searchQuery: '',
        fields: {},
        currFields: {},
        colors: {},
        selectedEntities: [],
        unselect: [],
      };
    },
    components: {
      'entities-menu': entitiesMenu,
      abstracts,
      'results-graph': resultsGraph,
      'entity-card': entityCard,
    },
    methods: {
      removeSelection(who) {
        this.unselect = [who];
      },
      addSearchTerm(who) {
        const query = lucene.compose(this.searchQuery, [who]);
        this.inputQuery = query;
        this.unselect = this.selectedEntities;
        this.selectedEntities = [];
        this.doSearch();
      },
      updateVertexSelection(selected) {
        this.selectedEntities = selected;
      },
      setFields(data, colors) {
        const vueCtx = this;
        data.forEach((d) => {
          vueCtx.colors[d.field] = colors[d.field];
        });
        vueCtx.currFields = data;
      },
      doSearch() {
        this.searchQuery = this.inputQuery;
        this.fields = this.currFields;
      },
    },
  };
</script>

<style lang="scss">
  .main-container {
    position:relative;
  }

  .search-container {
    position:relative;
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
    min-width:  100px;
    width: 20%;
    position: absolute;
    right: 20px;
    border-width: 1px;
    border-color: #888888;
    border-style: solid;
    box-shadow: 5px 5px 2px #888888;
  }
</style>
