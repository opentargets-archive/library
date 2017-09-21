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
  import Masthead from './components/Masthead.vue';
  import Mastfoot from './components/Mastfoot.vue';
  import Main from './components/Main.vue';
  import FiltersApplied from './components/FiltersApplied.vue';
  import { name, version } from './services/name';

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
        console.log('router is...');
        console.log(this.$route);
        return `/publications?query=${this.commonQueryUrl}`;
      },
      trendsUrl() {
        return `/trends?query=${this.commonQueryUrl}`;
      },
      topicsUrl() {
        return `/topics?query=${this.commonQueryUrl}`;
      },
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
