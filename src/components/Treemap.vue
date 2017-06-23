<template>
  <div> <!-- Root -->

    <div v-show="dataIsPresent">
      <q-select
        type="radio"
        v-model="selectedAgg"
        :options="treemapSelect"
      ></q-select>
      <div>
        <div id="resultsTreemap"></div>
      </div>

    </div>
  </div>
</template>


<script>
  import otsTreemap from 'ots-treemap';
  import chunks2hierarchy from '../services/chunks2hierarchy';

  export default {
    name: 'treemap',
    props: ['aggs', 'width', 'height', 'loading'],
    data() {
      return {
        dataIsPresent: false,
        isMounted: false,
        selectedAgg: 'terms',
        treemapSelect: [
          {
            label: 'Frequent terms',
            value: 'terms',
          },
          {
            label: 'Curated keywords',
            value: 'keywords',
          },
          {
            label: 'Mesh terms',
            value: 'mesh_terms',
          },
          {
            label: 'Chemicals',
            value: 'chemicals',
          },
          {
            label: 'Journals',
            value: 'journals',
          },
          {
            label: 'Authors',
            value: 'authors',
          },
        ],
      };
    },
    mounted() {
      console.log('it is mounted...');
      this.isMounted = true;
    },
    computed: {
      dataAndDims() {
        /* eslint no-unused-expressions: 0 */
        this.width;
        this.height;
        this.aggs;
        this.selectedAgg;
        this.isMounted;
        return Date.now();
      },
    },
    watch: {
      loading() {
        if (this.loading) {
          // clean prev version of the treemap
          const container = document.getElementById('resultsTreemap');
          container.innerHTML = '';
        }
      },
      dataAndDims() {
        if (!this.isMounted || !this.aggs ||
          !Object.keys(this.aggs).length ||
          !this.width ||
          !this.height) {
          return;
        }
        this.dataIsPresent = true;
        document.getElementById('resultsTreemap').innerHTML = '';

        const hierarchy = chunks2hierarchy(this.aggs[this.selectedAgg]);

        const w = this.width;
        const h = this.height;

        const container = document.getElementById('resultsTreemap');
        // Build a new treemap... (or update an existing treemap??)
        const tmap = otsTreemap()
          .data(hierarchy)
          .width(w - 70)
          .height(h)
          .on('click', (d) => {
            this.$emit('addFilter', {
              type: 'term',
              term: d.data.key,
            });
          });
        tmap(container);
      },
    },
  };
</script>
