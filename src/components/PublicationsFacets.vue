<template>
  <div class="publications-facet"> <!-- Root -->

    <!--<div class="facet-title">-->
      <!--Show related...:-->
    <!--</div>-->
    <!-- Genes facet -->
    <div class="facet-section-container">
      <span class="facet-section">Related genes
        <span v-if="facetSelected !== 'genes'" @click="facetSelected='genes'"><i class="fa fa-plus"></i></span>
        <span v-if="facetSelected === 'genes'" @click="facetSelected=null"><i class="fa fa-minus"></i></span>
      </span>
      <!--<genes-facet v-if="facetSelected==='genes'" :chips="genes" filterType="term"></genes-facet>-->
    </div>

    <!-- Diseases facet -->
    <div class="facet-section-container">
      <span class="facet-section">Related diseases
        <span v-if="facetSelected !== 'diseases'" @click="facetSelected='diseases'"><i class="fa fa-plus"></i></span>
        <span v-if="facetSelected === 'diseases'" @click="facetSelected=null"><i class="fa fa-minus"></i></span>
      </span>
      <!--<genes-facet v-if="facetSelected === 'diseases'" :chips="diseases" filterType="term"></genes-facet>-->
    </div>

    <!-- Drugs facet -->
    <div class="facet-section-container">
      <span class="facet-section">Related drugs
        <span v-if="facetSelected !== 'drugs'" @click="facetSelected='drugs'"><i class="fa fa-plus"></i></span>
        <span v-if="facetSelected === 'drugs'" @click="facetSelected=null"><i class="fa fa-minus"></i></span>
      </span>
      <!--<genes-facet v-if="facetSelected === 'diseases'" :chips="diseases" filterType="term"></genes-facet>-->
    </div>

    <!-- Top chunks -->
    <div class="facet-section-container">
      <span class="facet-section">Related terms
        <span v-if="facetSelected !== 'terms'" @click="facetSelected='terms'"><i class="fa fa-plus"></i></span>
        <span v-if="facetSelected === 'terms'" @click="facetSelected=null"><i class="fa fa-minus"></i></span>
      </span>
      <!--<genes-facet v-if="facetSelected === 'terms'" :chips="topChunks" filterType="term" chipLabel="key"></genes-facet>-->
    </div>

    <genes-facet v-if="facetSelected" :chips="chips" filterType="term" :chipLabel="chipLabel"></genes-facet>
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
        facetSelected: null,
        genes: [],
        diseases: [],
        topChunks: [],
      };
    },
    computed: {
      chipLabel() {
        let chipLabel;
        if (this.facetSelected === 'genes') {
          chipLabel = 'label';
        }
        if (this.facetSelected === 'diseases') {
          chipLabel = 'label';
        }
        if (this.facetSelected === 'drugs') {
          chipLabel = 'label';
        }
        if (this.facetSelected === 'terms') {
          chipLabel = 'key';
        }
        return chipLabel;
      },
      chips() {
        let chips;
        if (this.facetSelected === 'genes') {
          chips = this.genes;
        }
        if (this.facetSelected === 'diseases') {
          chips = this.diseases;
        }
        if (this.facetSelected === 'drugs') {
          chips = this.drugs;
        }
        if (this.facetSelected === 'terms') {
          chips = this.topChunks;
        }
        return chips;
      },
      ...mapGetters('aggs', {
        getAllAggs: 'getAllAggs',
      }),
    },
    watch: {
      getAllAggs() {
        this.genes = this.getAllAggs.genes.buckets;
        this.diseases = this.getAllAggs.diseases.buckets;
        this.topChunks = this.getAllAggs.top_chunks_significant_terms.buckets;
        this.drugs = this.getAllAggs.drugs.buckets;
      },
    },
  };
</script>

<style lang="scss">
  .publications-facet {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    .facet-section-container {
      display: inline-block;
      margin-right: 20px;
      background-color: floralwhite;
      padding: 2px;
      .facet-section {
        i {
          cursor: pointer;
          font-size: 0.7em;
        }
      }
    }
  }
</style>
