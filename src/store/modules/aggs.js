import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    currAggs: {},
    trends: {},
  },
  mutations: {
    setAggs(state, aggs) {
      Vue.set(state, 'currAggs', aggs);
    },
    setTrends(state, trends) {
      Vue.set(state, 'trends', trends);
    },
  },
  getters: {
    getAllAggs: state => state.currAggs,
    getAllTrends: state => state.trends,
  },
};

