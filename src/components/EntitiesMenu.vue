<template>

  <div class="main-menu-icons"> <!-- Root -->
    <span  @click="getNewEntity">
      <i class="fa fa-2x fa-plus-circle">
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 0]"
        >
          Add a field source for vertices
        </q-tooltip>
      </i>
    </span>
    <span v-for="entity in entities" class="chip-item" v-bind:style="{'background-color':colors[entity.field]}">
      {{entity.label}}
      <i @click="removeTerm(entity.field)" class="fa fa-close">
        <q-tooltip
          anchor="center right"
          self="center left"
          :offset="[10, 0]"
        >
          Remove this field source
        </q-tooltip>
      </i>
    </span>
  </div>

</template>

<script type="text/javascript">
  import { Dialog } from 'quasar-framework';
  import { filter } from 'lodash';
  import entitiesInfo from '../services/entities';

  export default {
    name: 'entities-menu',
    data() {
      return {
        entities: [],
        colors: entitiesInfo.colors,
      };
    },
    mounted() {
      this.entities = entitiesInfo.defaultEntities;
    },
    watch: {
      entities() {
        this.$emit('fields', this.entities, this.colors);
      },
    },
    methods: {
      removeTerm(entity) {
        this.entities = filter(this.entities, (d) => d.field !== entity);
      },
      getNewEntity() {
        const scope = this;
        Dialog.create({
          title: 'New source',
          message: 'Add a new field source for vertices',
          form: {
            field: {
              type: 'radio',
              items: entitiesInfo.vals,
              model: '',
            },
            certainty: {
              type: 'numeric',
              label: 'Certainty',
              model: 3,
              min: 1,
              max: 20,
            },
            size: {
              type: 'numeric',
              label: 'Size',
              model: 10,
              min: 1,
              max: 20,
            },
          },
          buttons: [
            'Cancel',
            {
              label: 'Ok',
              handler(data) {
                scope.entities.push({
                  field: data.field,
                  label: entitiesInfo.term2label[data.field],
                  size: data.size,
                  min_doc_count: data.certainty,
                });
              },
            },
          ],
        });
      },
    },
  };
</script>

<style lang="scss">
  .main-menu-icons {
    /*position: absolute;*/
    margin-top: 10px;
    margin-left: 10px;
    color: grey;
    :hover {
      color: black;
    }
  }

  .chip-item {
    opacity: 0.8;
    vertical-align: baseline;
    margin-left: 10px;
    i {
      cursor: pointer;
      vertical-align: inherit;
    }
    color: black;
    padding: 3px;
  }
</style>
