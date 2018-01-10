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

      <!--<span class="action-item search" @click="addSelectionToQuery">-->
        <!--<i class="fa fa-search-plus">-->
          <!--<q-tooltip-->
            <!--anchor="center right"-->
            <!--self="center left"-->
            <!--:offset="[10, 0]"-->
          <!--&gt;Add selected text to the search query-->
          <!--</q-tooltip>-->
        <!--</i>-->
      <!--</span>-->

      <!--<span class="action-item search" @click="setSelectionAsQuery">-->
        <!--<i class="fa fa-search">-->
          <!--<q-tooltip-->
            <!--anchor="center right"-->
            <!--self="center left"-->
            <!--:offset="[10, 0]"-->
          <!--&gt;Search for this text-->
          <!--</q-tooltip>-->
        <!--</i>-->
      <!--</span>-->

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
        console.log('add selection to filter...');
        this.addFilter({
          type: 'selection',
          term: this.selection,
        });
        // this.$emit('addSelectionToFilter', this.selection);
      },
      addSelectionToQuery() {
        // this.$emit('addSelectionToQuery', this.selection);
      },
      setSelectionAsQuery() {
        // this.$emit('setSelectionAsQuery', this.selection);
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
