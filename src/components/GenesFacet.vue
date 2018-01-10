<template>
  <div class="chips-container" v-show="chips.length"> <!-- Root -->

    <!-- chips -->
    <span class="chip" v-for="chip in chips" @click="setFilter(chip)">
      <span class="chip-text">{{chip[chipLabel]}} </span>
    </span>

  </div>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    props: {
      filterType: {},
      chips: {},
      chipLabel: {
        default: 'label',
        type: String,
      },
    },
    methods: {
      setFilter(chip) {
        this.addFilter({
          term: chip[this.chipLabel],
          type: this.filterType,
        });
      },
      ...mapMutations('filters', [
        'addFilter',
      ]),
    },
  };
</script>

<style lang="scss">
  .chips-container {
    margin-left: 10px;
    margin-right: 10px;
    white-space: normal;
    .chip {
      display: inline-block;
      border: 1px solid grey;
      padding: 4px;
      margin-right: 8px;
      margin-bottom: 5px;
      cursor: pointer;
      line-height: 1.8em;
      background-color: floralwhite;
      chip-text {
        white-space: nowrap;
      }
    }
  }
</style>
