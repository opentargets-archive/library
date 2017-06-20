<template>
  <span class="filter-pill" v-bind:style="{'background': pillColor}">
    <span>{{filter.term}}</span>
    <span class="actions">
      <span class="action-item remove" @click="removeFilter">
        <i class="fa fa-remove">
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
          > Remove this selection
          </q-tooltip>
        </i>
      </span>

      <span class="action-item search" @click="addFilterToSearch">
        <i class="fa fa-search-plus">
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
          >Add this term to the search query
          </q-tooltip>
        </i>
      </span>

      <span class="action-item search" @click="setFilterAsQuery">
        <i class="fa fa-search">
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
          >Search for this term
          </q-tooltip>
        </i>
      </span>

    </span>
  </span>
</template>

<script>
  import pillColors from '../services/pillColors';

  export default {
    name: 'filter-pill',
    props: ['filter'],
    methods: {
      addFilterToSearch() {
        this.$emit('addFilterToSearch', this.filter);
      },
      removeFilter() {
        this.$emit('removeFilter', this.filter);
      },
      setFilterAsQuery() {
        this.$emit('setFilterAsQuery', this.filter);
      },
    },
    computed: {
      pillColor() {
        return pillColors[this.filter.type];
      },
    },
  };
</script>

<style lang="scss">
  $border-radius: 5px;
  .filter-pill {
    margin-right: 10px;
    position:relative;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 60px;
    padding-left: 5px;
    border-radius: $border-radius;
    -webkit-border-radiud: $border-radius;
    -moz-border-radiud: $border-radius;
  }

  .actions {
    position: absolute;
    top: 2px;
    right: 0px;
    padding-left: 5px;
    display: inline-block;
    vertical-align: baseline;
    > .action-item {
      padding-right: 1px;
      padding-top: 2px;
      padding-bottom: 2px;
      cursor: pointer;
      > i {
        vertical-align: baseline;
      }
      /*&.search {*/
        /*background-color: #64b5f7;*/
      /*}*/
      /*&.remove {*/
        /*background-color: orange;*/
      /*}*/
    }
  }

</style>
