import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    currAggs: {},
  },
  mutations: {
    setAggs(state, aggs) {
      Vue.set(state, 'currAggs', aggs);
    },
  },
  getters: {
    getAllAggs: state => state.currAggs,
  },
};

