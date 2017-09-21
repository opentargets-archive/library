<template>
  <div> <!-- Root -->

    <!-- Genes facet -->
    <div>
      <span>Related genes: </span>
      <genes-facet :chips="genes" filterType="term"></genes-facet>
    </div>

    <!-- Diseases facet -->
    <div>
      <span>Related diseases: </span>
      <genes-facet :chips="diseases" filterType="term"></genes-facet>
    </div>

    <!-- Top chunks -->
    <div>
      <span>Related terms:</span>
      <genes-facet :chips="topChunks" filterType="term" chipLabel="key"></genes-facet>
    </div>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import genesFacet from './GenesFacet.vue';

  export default {
    components: {
      'genes-facet': genesFacet,
    },
    data() {
      return {
        genes: [],
        diseases: [],
        topChunks: [],
      };
    },
    computed: {
      ...mapGetters('aggs', {
        getAllAggs: 'getAllAggs',
      }),
    },
    watch: {
      getAllAggs() {
        this.genes = this.getAllAggs.genes.buckets;
        this.diseases = this.getAllAggs.diseases.buckets;
        this.topChunks = this.getAllAggs.top_chunks_significant_terms.buckets;
      },
    },
  };
</script>
