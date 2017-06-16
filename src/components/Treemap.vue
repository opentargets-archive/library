<template>
  <div>
    <div id="resultsTreemap"></div>
  </div>
</template>


<script>
  import otsTreemap from 'ots-treemap';
  import chunks2hierarchy from '../services/chunks2hierarchy';

  export default {
    name: 'treemap',
    props: ['chunks', 'width', 'height', 'loading'],
    computed: {
      dataAndDims() {
        /* eslint no-unused-expressions: 0 */
        this.width;
        this.height;
        this.chunks;
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
        if (!this.chunks.length || !this.width || !this.height) {
          return;
        }
        const hierarchy = chunks2hierarchy(this.chunks);

        const w = this.width;
        const h = this.height;

        const container = document.getElementById('resultsTreemap');
        // Build a new treemap... (or update an existing treemap??)
        const tmap = otsTreemap()
          .data(hierarchy)
          .width(w - 70)
          .height(h)
          .on('click', (d) => {
            console.log('in search we received the clicked element...');
            console.log(d);
          });
        tmap(container);
      },
    },
  };
</script>
