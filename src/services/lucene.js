import * as lucene from 'lucene';

export default {
  decode: lucene.parse,
  encode: lucene.toString,
  compose3(query, filters) {
    const filtersClean = filters.map((f) => {
      if (f.type === 'date') {
        // egypt AND pub_date:[1900-10-30 TO 2016-10-30]
        const [minYear, maxYear] = f.term.split('-');
        const dateMinStr = `${minYear}-01-01`;
        const dateMaxStr = `${maxYear}-12-31`;
        const luceneQuery = `pub_date:[${dateMinStr} TO ${dateMaxStr}]`;
        f.luceneQuery = luceneQuery;
        return luceneQuery;
      }
      f.luceneQuery = `"${f.term}"`;
      return f.luceneQuery;
    });
    return [query, ...filtersClean].join(' AND ');
  },
  compose2(query, topic, terms) {
    let termSoFar = query;
    if (topic && topic.name) {
      const topicTerm = [`"${topic.name}"`, ...topic.vertices.map((v) => `"${v.term}"`)].join(' OR ');
      termSoFar = `${termSoFar} AND (${topicTerm})`;
    }

    if (terms && terms.length) {
      terms.forEach((t) => {
        termSoFar = `${termSoFar} + AND text_mined_entities.noun_phrases.top_chunks:${t}`;
      });
    }

    return termSoFar;
  },
  compose(query, entities) {
    const leftAST = this.decode(query);
    if (!entities || !entities.length) {
      return this.encode(leftAST);
    }

    // 2nd Get the new elements to add to the queryParser
    function iter(acc, val) {
      const res = {
        left: {
          field: val.field,
          term: val.luceneQuery,
        },
      };
      if (acc) {
        res.operator = 'AND';
        res.right = acc;
      }
      return res;
    }

    const rightAST = this.arrayReduce(entities, iter);

    // 3rd get the final query by combining both terms...
    const queryAST = {
      left: leftAST,
      operator: 'AND',
      right: rightAST,
    };

    // 4th convert to text query
    const queryStr = this.encode(queryAST);
    return queryStr;
  },
  arrayReduce(array, iteratee, accumulator, initAccum) {
    /* eslint no-param-reassign: 0 */

    let index = -1;
    const length = array.length;

    if (initAccum && length) {
      index += 1;
      accumulator = array[index];
    }
    index += 1;
    while (index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
      index += 1;
    }
    return accumulator;
  },

};
