<template>
  <div> <!-- root -->
    <div class="card-container">
      <div class="simulated-vertex" :style="{'background-color':vertexColor}"></div>
      <span class="term-name">{{entity.term}}</span>
      <span class="actions">
        <span class="action-item remove" @click="removeSelection">
          <i class="fa fa-remove">
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            > Remove this selection
            </q-tooltip>
          </i>
        </span>

        <span class="action-item search" @click="addSearchTerm">
          <i class="fa fa-search">
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            >Add this term to the search query
            </q-tooltip>
          </i>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'entity-card',
    props: ['entity', 'colors'],
    computed: {
      vertexColor() {
        return this.colors[this.entity.field];
      },
    },
    methods: {
      removeSelection() {
        this.$emit('removeEntity', this.entity);
      },
      addSearchTerm() {
        this.$emit('addSearchTerm', this.entity);
      },
    },
  };
</script>

<style lang="scss">
  .card-container {
    margin-top: 10px;
    position: relative;

    .simulated-vertex {
      display: inline-block;
      margin-right: 10px;
      border-radius: 10px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }

    .term-name {
      font-size: 0.9em;
    }

    .actions {
      position: absolute;
      top: 0px;
      right: 0px;
      background-color: white;
      padding-left: 5px;
      display: inline-block;
      vertical-align: baseline;
      > .action-item {
        border-radius: 5px;
        margin: 3px;
        padding-left: 3px;
        padding-right: 3px;
        padding-top: 2px;
        padding-bottom: 2px;
        cursor: pointer;
        > i {
          vertical-align: baseline;
        }
        &.search {
          background-color: #64b5f7;
        }
        &.remove {
          background-color: orange;
        }
      }
    }
  }
</style>
