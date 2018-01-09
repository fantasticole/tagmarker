export default function getBookmarksAndFolders (data) {
  let { bookmarks, relations } = data;

  bookmarks.forEach(b => {
    // for each of the bookmarks tags
    b.tags.forEach(id => {
      // connect the corresponding tag ids
      relations[id] = relations[id] ? Array.from(new Set([...relations[id], ...b.tags])) : b.tags;
    })
  })

  data.relations = relations;
  return data;
}
