export default function getBookmarksAndFolders (bookmarksAndFolders, data) {
  for (var x in bookmarksAndFolders) {
    let { dateAdded, dateGroupModified, id, parentId, title } = bookmarksAndFolders[x],
        // use parent's ID to get all previous parents IDs
        // if parent's ID is 0 or undefined, set parents as empty array
        // could hide 1 (Bookmarks Bar) and 2 (Other Bookmarks) as well
        parents = Number(parentId) ? [ parentId, ...data['tags'][parentId].parents ] : [];

    // if the current object has children, it's a folder
    if (bookmarksAndFolders[x].children) {
      // add folder's information to the data's tags object
      data['tags'][id] = {
        dateAdded,
        dateGroupModified,
        id,
        parentId,
        parents,
        title,
        bookmarks: [],
      }
      getBookmarksAndFolders(bookmarksAndFolders[x].children, data);
    }
    // otherwise, it's a bookmark
    else {
      // add bookmark's information to the data's bookmarks object
      data['bookmarks'][id] = {
        dateAdded,
        id,
        parentId,
        // list of every folder the bookmark is a child of
        tags: parents,
        title,
        url: bookmarksAndFolders[x].url,
      };
      // for each parent folder's corresponding tag
      for (var y in parents) {
        // if the current parent is the bookmarks bar or
        // other bookmarks folder
        if (parents[y] === ("1" || "2")) {
          // only push the bookmark id if it's a direct child
          if (parentId === parents[y]) data['tags'][parents[y]]['bookmarks'].push(id);
        }
        // add bookmark id to its bookmarks folder
        else data['tags'][parents[y]]['bookmarks'].push(id);
      }
    };
  }
  // remove parent of bookmarks bar/other bookmarks
  delete data.tags["0"];
  return data;
}
