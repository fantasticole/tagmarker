export default function getChildren(node, all) {
  if (node.children) {
    all.tags = [...all.tags, node.id];
    node.children.forEach(n => {
      return getChildren(n, all);
    })
  }
  else all.bookmarks = [...all.bookmarks, node.id];
  return all;
}
