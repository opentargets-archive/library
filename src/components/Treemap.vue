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
    watch: {
      loading() {
        if (this.loading) {
          // clean prev version of the treemap
          const container = document.getElementById('resultsTreemap');
          container.innerHTML = '';
        }
      },
      chunks() {
        const hierarchy = chunks2hierarchy(this.chunks);
        console.log(hierarchy);

        const w = this.width;
        const h = this.height;

        const container = document.getElementById('resultsTreemap');
        // Build a new treemap... (or update an existing treemap??)
        const tmap = otsTreemap()
          .data(hierarchy)
          .width(w * 0.6)
          .height(h * 0.8)
          .on('click', (d) => {
            console.log('in search we received the clicked element...');
            console.log(d);
          });
        tmap(container);
      },
    },
  };
</script>
