import Vue from 'vue';
import Vuex from 'vuex';

import filters from './modules/filters';
import aggs from './modules/aggs';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    filters,
    aggs,
  },
});

