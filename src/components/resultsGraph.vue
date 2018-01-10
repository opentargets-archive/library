<template>
  <!-- Display the results -->
  <div class="row gutter wrap justify-stretch content-center"> <!-- root -->
    <div class="prefilter-container" v-show="filtersToApply.length">Apply
      <span v-if="filtersToApply.length === 1">this filter</span>
      <span v-else>these filters</span>:
      <span class="prefilter-pill" v-for="filter in filtersToApply">
        <span class="prefilter-term">{{filter.term}}</span>
        <span><i class="fa fa-remove" @click="removePrefilter(filter)">
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
          > Discard this selection
          </q-tooltip>

        </i></span>
      </span>
      <span class="apply-prefilters" @click="applyPrefilters">
        <i class="fa fa-check-circle-o"></i>
      </span>
    </div>

    <div class="topics-container">
      <!--<p class="tip" v-if="query">Graph for <b>{{query}}</b></p>-->

      <div v-show="showSpinner">
        <i class="fa fa-spinner fa-2x fa-spin" aria-hidden="true"></i>
      </div>

      <div v-show="!showSpinner && !showFailed" class="topics-menu">
        <div
          class="topic-item"
          @click="topicVisible=!topicVisible"
          style="background: #333333; color:#f4f4f4"
        >Topics <i :class="['fa', topicVisible ? 'fa-caret-down' : 'fa-caret-right']"></i></div>
        <div v-for="topic in topics" :style="{'background-color':topic.color, 'opacity':'0.8', display:topicVisible ? 'block' : 'none'}" class="topic-item" @click="selectTopic(topic);">
          {{topic.name}}
        </div>
      </div>

      <div class="page-spinner" v-show="showFailed">
        <div class="message">
          No graph to show
        </div>
      </div>

      <div id="graphContainer"></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import otSearch from 'otl-graph';
  import entities from '../services/entities';
  import lucene from '../services/lucene';


  let graph; // The graph
  export default {
    name: 'results-graph',
    // props: [
    //   'query',
    //   'width',
    //   'height',
    //   'removedFilter',
    // ],
    data() {
      return {
        width: 200,
        height: 800,
        showSpinner: false,
        showFailed: false,
        topics: [],
        filtersToApply: [],
        fields: entities.defaultEntities,
        colors: entities.colors,
        topicVisible: false,
      };
    },
    computed: {
      // compoundProperty is made to watch for both properties (query and fields) since Vue.js doesn't have a watchGroup or similar
      // compoundProperty() {
        /* eslint no-unused-expressions: 0 */
        // Only need to reference the properties
        // this.query;
        // this.fields;

        // different value every time to make sure the watch on this property is fired
        // return Date.now();
      // },
      ...mapGetters('filters', [
        'getAllFilters',
      ]),
    },
    methods: {
      selectTopic(topic) {
        graph.clickTopic(topic);
      },
      applyPrefilters() {
        const vueCtx = this;
        vueCtx.filtersToApply.forEach(f => {
          vueCtx.addFilter({
            term: f.term,
            type: f.type,
          });
        });
      },
      removePrefilter(f) {
        graph.unselect(graph.getVertexByTerm(f.term));
        this.filtersToApply = this.filtersToApply.filter(ff => ff.term !== f.term);
      },
      ...mapMutations('filters', [
        'addFilter',
      ]),
    },
    mounted() {
      const vueCtx = this;
      vueCtx.showSpinner = true;
      vueCtx.showFailed = false;

      /* eslint no-bitwise: 0 */
      vueCtx.width = ~~(vueCtx.$el.clientWidth);

      // Remove any previous instance of the graph
      const graphContainer = document.getElementById('graphContainer');
      graphContainer.innerHTML = '';

      // Remove all the labels from the fields object;
      const cleanFields = [];
      vueCtx.fields.forEach((f) => {
        /* eslint max-len: 0 */
        /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["f"] }] */
        const clonedObj = Object.assign({}, f);
        delete clonedObj.label;
        cleanFields.push(clonedObj);
      });

      const query = lucene.compose3(this.getAllFilters);
      console.log(`query for graph is... ${query}`);
      console.log(`unescaped query... ${decodeURI(query)}`);

      graph = otSearch()
        .width(this.width - 100)
        .height(this.height - 120)
        .nodeSize(10)
        .query(query)
        .fields(cleanFields)
        .colors(vueCtx.colors);

      graph(document.getElementById('graphContainer'));
      graph.on('loaded', (graphData) => {
        vueCtx.showSpinner = false;
        // const gr = graphData.graph;
        const topics = graphData.topics;
        vueCtx.topics = topics.slice(0, 12);
      });
      graph.on('failed', () => {
        console.log('the graph did not load... :-(');
        vueCtx.showFailed = true;
        vueCtx.showSpinner = false;
      });
      graph.on('selected', (v) => {
        console.log('selected event fired...');
        console.log(v);
        vueCtx.filtersToApply.push({
          type: 'topic',
          term: v.subject.term,
          node: v.subject,
        });
      });
      graph.on('unselected', (v) => {
        // this.$emit('selected', v.selected);
        console.log('unselected event fired...');
        console.log(v);
        vueCtx.filtersToApply = vueCtx.filtersToApply.filter(f => f.term !== v.subject.term);
      });
      graph.on('topicSelected', (t) => {
        console.log('selected topic!!');
        console.log(t);
        // this.$emit('selectedTopic', t);
      });
      graph.on('topicUnselected', (t) => {
        console.log('unselected topic!!');
        console.log(t);
        // this.$emit('selectedTopic', t);
      });
    },
    watch: {
//      unselect() {
//        this.unselect.forEach((n) => {
//          graph.select(n);
//        });
//        // graph.select(this.unselect);
//      },
      removedFilter(f) {
        if (f.type === 'topic') {
          graph.unselect(graph.getVertexByTerm(f.term));
        }
      },
      // compoundProperty() {
      // },
    },
  };
</script>

<style lang="scss">

  .topics-container {
    // position: absolute;

    .topics-menu {
      position:absolute;
      // width: 150px;
      font-size: 0.8em;
      right: 30px;
      // padding: 10px;
      padding-left: 10px;
      padding-right: 10px;
      background: white;

      >.topic-item {
        margin-top: 5px;
        padding: 5px;
        cursor: pointer;
      }
    }

    #graphContainer {
      cursor: pointer;
    }
  }

  .prefilter-container {
    position: absolute;
    margin-top: 10px;
    margin-left: 10px;
  }
  .apply-prefilters {
    font-size: 1.2em;
    color: green;
    cursor: pointer;
  }
  .prefilter-pill {
    margin-top: 20px;
    margin-right: 10px;
    position: relative;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 5px;
    padding-left: 5px;
    background: #E0DFDC;
    i {
      vertical-align: baseline;
      cursor: pointer;
    }
  }

</style>
