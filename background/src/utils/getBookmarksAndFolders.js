export default function getBookmarksAndFolders (bookmarksAndFolders, data) {
  for (var x in bookmarksAndFolders) {
    let { dateAdded, dateGroupModified, id, parentId, title } = bookmarksAndFolders[x],
        parentTag = data['tags'][parentId],
        // use parent's ID to get all previous parents IDs
        // if parent's ID is 0 or undefined, set parents as empty array
        // could hide 1 (Bookmarks Bar) and 2 (Other Bookmarks) as well
        parents = Number(parentId) ? [ parentId, ...parentTag.parents ] : [];

    // if the current object has children, it's a folder
    if (bookmarksAndFolders[x].children) {
      // if this folder is a child of the bookmarks bar or other bookmarks
      if (parentTag && parentTag.title === ("Bookmarks Bar" || "Other Bookmarks")) {
        // remove that parent folder's id from its 'parents' array
        parents.splice(parents.indexOf(parentId), 1);
      }
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
        data['tags'][parents[y]]['bookmarks'].push(id);
      }
    };
  }
  // remove parent of bookmarks bar/other bookmarks
  delete data.tags["0"];
  return data;
}
