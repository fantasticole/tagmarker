export default function getBookmarksAndFolders (data) {
  let { bookmarks, tags } = data;

  bookmarks.forEach(b => {
    // for each of the bookmarks tags
    b.tags.forEach(t => {
      // get all unique connected tags, meaning all tags for each
      // bookmark in the tag's bookmarks array
      let connections = Array.from(new Set([...tags[t].related, ...b.tags]));

      // remove the current tag's id from its connections list
      connections.splice(connections.indexOf(t), 1)
      // make sure they're linked to 
      tags[t].related = connections;
    })
  })

  data.tags = tags;
  return data;
}