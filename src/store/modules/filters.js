import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    currFilters: {},
    quoted: {
      query: true,
      topic: true,
      trends: true,
      date: false,
      term: true,
      selection: true,
    },
    uniqueFields: {
      query: true,
      topic: false,
      trends: false,
      date: true,
      term: false,
      selection: false,
    },
  },
  mutations: {
    /* eslint no-param-reassign: 0 */
    addFilter(state, filter) {
      const currFilters = state.currFilters;
      // Make sure the filter is quoted (but not on date ranges
      if (state.quoted[filter.type]) {
        if ((filter.term.charAt(0) !== '"') && (filter.term.charAt(filter.term.length - 1))) {
          filter.term = `"${filter.term}"`;
        }
      }

      if (state.uniqueFields[filter.type]) {
        Vue.set(currFilters, filter.type, [filter]);
      }
      else {
        if (!state.currFilters[filter.type] || !state.currFilters[filter.type].length) {
          Vue.set(currFilters, filter.type, []);
        }
        currFilters[filter.type].push(filter);
      }
      if (currFilters) {
        Vue.set(state, 'currFields', currFilters);
      }
    },

    removeAllFilters(state) {
      state.currFilters = {};
    },

    removeFilter(state, filter) {
      const thisFilter = state.currFilters[filter.type];
      const newFilters = [];
      for (let i = 0; i < thisFilter.length; i += 1) {
        const f = thisFilter[i];
        if (f.term !== filter.term) {
          newFilters.push(filter);
        }
      }

      if (newFilters.length) {
        // state.currFilters[filter.type] = newFilters;
        Vue.set(state.currFilters, filter.type, newFilters);
      }
      else {
        // delete state.currFilters[filter.type];
        Vue.delete(state.currFilters, filter.type);
      }
    },
  },
  getters: {
    getAllFilters: state => {
      let ftemp = [];
      Object.keys(state.currFilters).forEach((type) => {
        ftemp = [...ftemp, ...state.currFilters[type]];
      });
      return ftemp;
    },
  },
};
