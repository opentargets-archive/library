const entities = {
  entities: {
    label: 'Entities',
    value: 'text_mined_entities.noun_phrases.chunks',
  },
  abstract: {
    label: 'Abstract',
    value: 'abstract',
  },
  title: {
    label: 'Title',
    value: 'title',
  },
  author: {
    label: 'Author',
    value: 'authors.full_name',
  },
  keyword: {
    label: 'Keyword',
    value: 'keywords',
  },
  mesh: {
    label: 'Mesh term',
    value: 'mesh_headings.label',
  },
};

export default {
  vals: [
    entities.entities,
    entities.abstract,
    entities.title,
    entities.author,
    entities.keyword,
    entities.mesh,
  ],
  defaultEntities: [
    {
      field: entities.entities.value,
      label: entities.entities.label,
      min_doc_count: 1,
      size: 200,
    },
    // {
    //   field: entities.abstract.value,
    //   label: entities.abstract.label,
    //   min_doc_count: 5,
    //   size: 10,
    // },
    // {
    //   field: entities.author.value,
    //   label: entities.author.label,
    //   min_doc_count: 5,
    //   size: 10,
    // },
    // {
    //   field: entities.mesh.value,
    //   label: entities.mesh.label,
    //   min_doc_count: 5,
    //   size: 10,
    // },
  ],
  term2label: {
    entities: 'Entities',
    abstract: 'Abstract',
    title: 'Title',
    'authors.full_name': 'Authors',
    keywords: 'Keywords',
    'mesh_headings.label': 'Mesh terms',
  },
  label2term: {
    Entities: 'entities',
    Abstract: 'abstract',
    Title: 'title',
    Authors: 'authors.full_name',
    Keywords: 'keywords',
    'Mesh terms': 'mesh_headings.label',
  },
  colors: {
    'text_mined_entities.noun_phrases.top_chunks': '#8da0cb',
    abstract: '#ffd92f',
    title: '#66c2a5',
    'authors.full_name': '#e78ac3',
    keywords: '#a6d854',
    'mesh_headings.label': '#fdb462',
  },
};
