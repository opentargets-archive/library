<template>
  <span class="filter-pill" v-bind:style="{'background': pillColor}">
    <span>{{filter.term}} | <span class="type">{{filter.type}}</span></span>
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

    </span>
  </span>
</template>

<script>
  import { mapMutations } from 'vuex';
  import pillColors from '../services/pillColors';

  export default {
    name: 'filter-pill',
    props: ['filter'],
    methods: {
      removeFilter() {
        this.removeFilterFromStore(this.filter);
      },
      ...mapMutations('filters', {
        removeFilterFromStore: 'removeFilter',
      }),
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
    margin-top: 20px;
    margin-right: 10px;
    position:relative;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 20px;
    padding-left: 5px;
    border-radius: $border-radius;
    -webkit-border-radiud: $border-radius;
    -moz-border-radiud: $border-radius;

    .type {
      font-size: 0.8em;
      color: #333333;
      vertical-align: baseline;
    }
  }

  .actions {
    position: absolute;
    top: 2px;
    right: 2px;
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
    }
  }

</style>
