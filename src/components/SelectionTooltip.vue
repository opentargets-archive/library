<template>
  <div> <!-- root -->
    <div v-show="selection"
         ref="selectedText"
         class="my-tooltip"
    >
      {{selection}}
      <span class="action-item search" @click="addSelectionToFilter">
        <i class="fa fa-filter">
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
          >Use the selected text to filter the abstracts
          </q-tooltip>
        </i>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    name: 'selection-tooltip',
    props: ['selection'],
    methods: {
      addSelectionToFilter() {
        this.addFilter({
          type: 'selection',
          term: this.selection,
        });
      },
      ...mapMutations('filters', [
        'addFilter',
      ]),
    },
  };
</script>

<style lang="scss">
  .action-item {
    cursor: pointer;
  }

  .my-tooltip {
    padding: 10px;
    border-radius: 5px;
    box-shadow: 10px 10px 5px #888888;
    -webkit-box-shadow: 10px 10px 5px #888888;
    -moz--webkit-box-shadow: 10px 10px 5px #888888;
    border: 1px #888888;
    border-style: solid;
    background: #ffffff;
  }
</style>
