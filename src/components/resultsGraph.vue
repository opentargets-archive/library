<template>
  <!-- Display the results -->
  <div class="topics-container"> <!-- root -->
    <!--<p class="tip" v-if="query">Graph for <b>{{query}}</b></p>-->

    <div v-show="showSpinner">
      <i class="fa fa-spinner fa-2x fa-spin" aria-hidden="true"></i>
    </div>


    <div v-show="!showSpinner" class="topics-menu">
      <!--<div v-for="topic in topics" :style="{'background-color': topic.color, 'opacity':'0.8'}" class="topic-item" @click="selectTopic(topic);">-->
        <!--{{topic.name}} &#45;&#45; {{topic.vertices.length}}-->
      <!--</div>-->
    </div>

    <div class="page-spinner" v-show="showFailed">
      <div class="message">
        No graph to show
      </div>
    </div>

    <div id="graphContainer"></div>
  </div>
</template>

<script>
  import otSearch from 'ots-graph';
  import entities from '../services/entities';

  let graph; // The graph
  export default {
    name: 'results-graph',
    props: [
      'query',
      'width',
      'height',
      'removedFilter',
    ],
    data() {
      return {
        showSpinner: false,
        showFailed: false,
        topics: [],
        fields: entities.defaultEntities,
        colors: entities.colors,
      };
    },
    computed: {
      // compoundProperty is made to watch for both properties (query and fields) since Vue.js doesn't have a watchGroup or similar
      compoundProperty() {
        /* eslint no-unused-expressions: 0 */
        // Only need to reference the properties
        this.query;
        this.fields;

        // different value every time to make sure the watch on this property is fired
        return Date.now();
      },
    },
    methods: {
      selectTopic(topic) {
        graph.clickTopic(topic);
      },
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
      compoundProperty() {
        const vueCtx = this;
        vueCtx.showSpinner = true;
        vueCtx.showFailed = false;

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

        graph = otSearch()
          .width(this.width - 100)
          .height(this.height - 120)
          .nodeSize(10)
          .query(vueCtx.query)
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
          this.$emit('addFilter', {
            type: 'topic',
            term: v.subject.term,
            node: v.subject,
          });
        });
        graph.on('unselected', (v) => {
          // this.$emit('selected', v.selected);
          this.$emit('removeFilter', {
            type: 'topic',
            term: v.subject.term,
            node: v.subject,
          });
        });
        graph.on('topicSelected', (t) => {
          this.$emit('selectedTopic', t);
        });
        graph.on('topicUnselected', (t) => {
          this.$emit('selectedTopic', t);
        });
      },
    },
  };
</script>

<style lang="scss">

  .topics-container {
    position: absolute;

    .topics-menu {
      position:absolute;
      width: 150px;
      font-size: 0.8em;
      right: 10px;
      padding: 10px;
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
</style>
