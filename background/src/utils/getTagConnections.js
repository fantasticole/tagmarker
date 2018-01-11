export default function getTagConnections (data) {
  let { bookmarks, relations } = data;

  // for each bookmark in the bookmarks object
  Object.values(bookmarks).forEach(b => {
    // for each of the bookmark's tags
    b.tags.forEach(id => {
      // connect the corresponding tag ids
      relations[id] = relations[id] ? Array.from(new Set([...relations[id], ...b.tags])) : b.tags;
    })
  })

  data.relations = relations;
  return data;
}
