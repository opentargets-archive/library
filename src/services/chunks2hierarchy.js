/* global d3:true */

export default function (chunks) {
  const root = {
    name: 'root',
    children: [],
  };
  chunks.forEach((d) => {
    root.children.push(d);
  });

  return d3.hierarchy(root)
    .sum((d) => d.doc_count)
    .sort((d) => d.doc_count);
}
