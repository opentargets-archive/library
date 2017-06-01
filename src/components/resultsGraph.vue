<template>
  <!-- Display the results -->
  <div> <!-- root -->
    <!--<p class="tip" v-if="query">Graph for <b>{{query}}</b></p>-->

    <div class="page-spinner" v-show="showSpinner">
      <i class="fa fa-spinner fa-2x fa-spin message" aria-hidden="true"></i>
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

  let graph; // The graph
  export default {
    name: 'results-graph',
    props: [
      'query',
      'fields',
      'colors',
      'unselect', // Programmatic unselection of nodes, expects and array of nodes to unselect
      'width',
      'height',
    ],
    data() {
      return {
        showSpinner: false,
        showFailed: false,
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
    watch: {
      unselect() {
        this.unselect.forEach((n) => {
          graph.select(n);
        });
        // graph.select(this.unselect);
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
          .width(this.width)
          .height(this.height)
          .nodeSize(10)
          .query(vueCtx.query)
          .fields(cleanFields)
          .colors(vueCtx.colors);

        graph(document.getElementById('graphContainer'));
        graph.on('loaded', () => {
          vueCtx.showSpinner = false;
        });
        graph.on('failed', () => {
          vueCtx.showFailed = true;
          vueCtx.showSpinner = false;
        });
        graph.on('selected', (v) => {
          this.$emit('selected', v.selected);
        });
        graph.on('unselected', (v) => {
          this.$emit('selected', v.selected);
        });
      },
    },
  };
</script>

<style lang="scss">
  /*.tip {*/
    /*position:absolute;*/
    /*right: 10px;*/
  /*}*/

  .page-spinner {
    width: 10%;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
    >.message {
      margin-top:150px;
    }
  }
</style>
