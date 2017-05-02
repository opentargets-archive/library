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
    <span v-for="entity in entities" class="chip-item" v-bind:style="{color:colors[entity.field]}">
      {{entity.field}}
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
  import * as chromatic from 'd3-scale-chromatic';

  const colors = chromatic.schemeSet1;

  export default {
    name: 'entities-menu',
    data() {
      return {
        entities: [],
        colors: {},
      };
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
              items: [
                { label: 'Abstract', value: 'abstract' },
                { label: 'Title', value: 'title' },
                { label: 'Author', value: 'authors.full_name' },
                { label: 'Keywords', value: 'keywords' },
                { label: 'Mesh term', value: 'mesh_headings.label' },
              ],
              model: '',
            },
            terms: {
              type: 'numeric',
              label: 'Max terms per hop',
              model: 10,
              min: 3,
              max: 20,
            },
            size: {
              type: 'numeric',
              label: 'Size',
              model: 10,
              min: 3,
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
                  min_doc_count: data.terms,
                  size: data.size,
                  // color: colors[scope.entities.length % colors.length],
                });

                scope.colors[data.field] = colors[scope.entities.length % colors.length];
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
    position: absolute;
    margin-top: 10px;
    margin-left: 10px;
    color: grey;
    cursor: pointer;
    :hover {
      color: black;
    }
  }

  .chip-item {
    vertical-align: baseline;
    margin-left: 10px;
    i {
      vertical-align: inherit;
    }
  }
</style>
