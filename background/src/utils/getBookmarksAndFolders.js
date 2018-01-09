import getTagConnections from './getTagConnections';

export default function getBookmarksAndFolders (bookmarks, data) {
  for (var x in bookmarks) {
    let { dateAdded, dateGroupModified, id, parentId, title } = bookmarks[x],
        // use parent's ID to get all previous parents IDs
        // if parent's ID is 0 or undefined, set parents as empty array
        // could hide 1 (Bookmarks Bar) and 2 (Other Bookmarks) as well
        parents = Number(parentId) ? [ parentId, ...data['tags'][parentId].parents ] : [];

    // if the current object has children, it's a folder
    if (bookmarks[x].children) {
      // add folder's information to the data's tags object
      data['tags'][id] = {
        dateAdded,
        dateGroupModified,
        id,
        parentId,
        parents,
        title,
        bookmarks: [],
        related: [],
      }
      getBookmarksAndFolders(bookmarks[x].children, data);
    }
    // otherwise, it's a bookmark
    else {
      // add bookmark's information to the data's bookmarks object
      data['bookmarks'].push({
        dateAdded,
        id,
        parentId,
        // list of every folder the bookmark is a child of
        tags: parents,
        title,
        url: bookmarks[x].url,
      });
      // for each parent folder's corresponding tag
      for (var y in parents) {
        // add bookmark id to its bookmarks folder
        data['tags'][parents[y]]['bookmarks'].push(id);
      }
    };
  }
  // remove parent of bookmarks bar/other bookmarks
  delete data.tags["0"];
  return getTagConnections(data);
}
