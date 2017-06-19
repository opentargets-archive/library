<template>
  <div> <!-- Root -->

    <div>
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
    computed: {
      dataAndDims() {
        /* eslint no-unused-expressions: 0 */
        this.width;
        this.height;
        this.aggs;
        this.selectedAgg;
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
        if (!this.aggs || !Object.keys(this.aggs).length || !this.width || !this.height) {
          return;
        }
        document.getElementById('resultsTreemap').innerHTML = '';

        console.log('calling chunks2hierarchy...');
        console.log(this.aggs);
        console.log(this.selectedAgg);
        console.log(this.aggs[this.selectedAgg]);
        const hierarchy = chunks2hierarchy(this.aggs[this.selectedAgg]);
        console.log('hierarchy...');
        console.log(hierarchy);

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
