const entities = {
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
    entities.abstract,
    entities.title,
    entities.author,
    entities.keyword,
    entities.mesh,
  ],
  defaultEntities: [
    {
      field: entities.abstract.value,
      label: entities.abstract.label,
      min_doc_count: 5,
      size: 10,
    },
    {
      field: entities.author.value,
      label: entities.author.label,
      min_doc_count: 5,
      size: 10,
    },
    {
      field: entities.mesh.value,
      label: entities.mesh.label,
      min_doc_count: 5,
      size: 10,
    },

  ],
  term2label: {
    abstract: 'Abstract',
    title: 'Title',
    'authors.full_name': 'Authors',
    keywords: 'Keywords',
    'mesh_headings.label': 'Mesh terms',
  },
  colors: {
    abstract: '#ffd92f',             // yellow
    title: '#66c2a5',                // greenish
    'authors.full_name': '#e78ac3',  // purple
    keywords: '#a6d854',           // green
    'mesh_headings.label': '#fdb462', // orange
  },
};
