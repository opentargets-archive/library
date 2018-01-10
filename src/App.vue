<template>
  <q-layout>
    <!--<masthead slot="header"></masthead>-->

    <q-drawer>

      <div class="list platform-delimiter">
        <div class="list-header">
          <div class="logo bg-primary">
            <q-toolbar-title :padding="1">
              <span class="open-targets">OpenTargets</span> | {{name}} <sup class="beta-tag bg-negative">{{version}}</sup>
            </q-toolbar-title>
          </div>
        </div>


        <q-drawer-link icon="view_list" :to="publicationsUrl">Publications</q-drawer-link>
        <q-drawer-link icon="date_range" :to="dateRangeUrl">Date range</q-drawer-link>
        <q-drawer-link icon="trending_up" :to="trendsUrl">Trends</q-drawer-link>
        <q-drawer-link icon="border_outer" :to="topicsUrl">Topics graph</q-drawer-link>
      </div>
    </q-drawer>

    <div id="searchbox" class="layout-view bg-light" ref="wrap">
      <div>
        <searchbox></searchbox>
      </div>
      <div>
        <applied-filters></applied-filters>
      </div>
      <router-view></router-view>
    </div>
    <!--<mastfoot slot="footer"></mastfoot>-->
  </q-layout>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Masthead from './components/Masthead.vue';
  import Mastfoot from './components/Mastfoot.vue';
  import Main from './components/Main.vue';
  import FiltersApplied from './components/FiltersApplied.vue';
  import { name, version } from './services/name';
  import lucene from './services/lucene';
  import router from './router';

  export default {
    name: 'app',
    data() {
      return {
        name,
        version,
      };
    },
    computed: {
      commonQueryUrl() {
        return this.$route.query.query;
      },
      publicationsUrl() {
        return `/publications?query=${this.commonQueryUrl}`;
      },
      dateRangeUrl() {
        return `date-range?query=${this.commonQueryUrl}`;
      },
      trendsUrl() {
        return `/trends?query=${this.commonQueryUrl}`;
      },
      topicsUrl() {
        return `/topics?query=${this.commonQueryUrl}`;
      },
      ...mapGetters('filters', [
        'getAllFilters',
      ]),
    },
    watch: {
      getAllFilters() {
        console.warn('filters have changed and I can see them from App.vue');
        console.log(this.getAllFilters);
        // const currQuery = _.clone(this.$route.query);
        const currQuery = Object.assign({}, this.$route.query);
        console.log(`current path: ${this.$route.path}`);
        console.log(currQuery);
        const query = lucene.compose3(this.getAllFilters);
        console.log(query);

        router.push({
          path: 'publications',
          query: {
            ...currQuery,
            query,
          },
        });
      },
    },
    mounted() {
      const params = this.parseParams();
      if (params.query) {
        this.addFilter({
          term: params.query,
          type: 'query',
        });
      }
    },
    methods: {
      parseParams() {
        const url = window.location.href;

        const pos = url.indexOf('?');
        if (pos < 0) {
          return {};
        }
        const params = {};
        const hashes = url.slice(pos + 1).split('&');

        for (let i = 0; i < hashes.length; i += 1) {
          const hash = hashes[i].split('=');
          params[hash[0]] = decodeURI(hash[1]) || null;
          // vars.push({ name: hash[0], value: hash.length > 1 ? hash[1] : null });
        }
        return params;
      },
      ...mapMutations('filters', [
        'addFilter',
      ]),
    },
    components: {
      masthead: Masthead,
      mastfoot: Mastfoot,
      searchbox: Main,
      'applied-filters': FiltersApplied,
    },
  };
</script>

<style lang="scss">
  #searchbox {
    width:100%;
  }

  .version {
    font-size: 0.7em;
  }

  .open-targets {
    opacity: 0.8;
  }
  .beta-tag {
    font-size: 0.5em;
    font-weight: bold;
    padding: 3px;
    color: white;
  }
  .logo {
    min-height: 3em;
    line-height: 3em;
    vertical-align: middle;
    color: white;
  }

</style>
