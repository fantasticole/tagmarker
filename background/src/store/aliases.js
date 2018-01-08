import { createOrUpdateTag, setFolder, updateBookmark } from './actions';

function addTags (originalAction) {
  let { bookmarkId, tagIds } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tagMarkerFolder, tags } = getState(),
        // get bookmark object to add from
        bookmark = bookmarks.find(b => (b.id === bookmarkId)),
        // TODO: make sure there is always a folder chosen
        tagMarkerFolderId = tagMarkerFolder.id ? tagMarkerFolder.id : "1",
        tagPromises = tagIds.map(id => (createTag(tags, id, bookmarkId, tagMarkerFolder.id, dispatch)));

    Promise.all(tagPromises).then(idsToAdd => {
      // update the bookmark's tags to add the new ones
      bookmark.tags = bookmark.tags.concat(idsToAdd);
      return dispatch(updateBookmark(bookmark));
    });
  }
}

function createTag (tags, tagId, bookmarkId, tagMarkerFolderId, dispatch) {
  let tagToUpdate = tags[tagId];

  // if we have a tag for the id already
  if (tagToUpdate) {
    // add the bookmark's id to the tag's bookmarks array
    tagToUpdate.bookmarks.push(bookmarkId);
    // update the tag in the store
    dispatch(createOrUpdateTag(tagToUpdate));
    return tagToUpdate.id;
  }
  // otherwise, create a folder for the new tag
  // inside of the tagmarker folder
  return new Promise((resolve, reject) => {
    chrome.bookmarks.create({
      parentId: tagMarkerFolderId,
      title: tagId
    }, resolve);
  }).then(folder => {
    // add the folder we just created to the store as a tag
    // with the bookmark as an item in its bookmarks array
    let  { dateAdded, dateGroupModified, id, parentId, title } = folder,
        // get parents array and add immediate parent
        parents = [...tags[parentId].parents, parentId],
        newTag = {
          dateAdded,
          dateGroupModified,
          id,
          parentId,
          parents,
          title,
          bookmarks: [ bookmarkId ],
        };

    // add the tag to the store
    dispatch(createOrUpdateTag(newTag));
    return id;
  })
}

function deleteTags (originalAction) {
  let { bookmarkId, tagIds } = originalAction;

  return (dispatch, getState) => {
    let tags = getState().tags,
        bookmarks = getState().bookmarks,
        // get object for each tag being deleted
        tagsToDelete = tagIds.map(id => (tags[id])),
        // get bookmark object to delete from
        bookmark = bookmarks.find(b => (b.id === bookmarkId)),
        // get bookmark's tags that aren't in the tagIds to be deleted
        updatedTagList = bookmark.tags.filter(id => (!tagIds.includes(id)));

    // remove the bookmark id from each tag's object
    tagsToDelete.forEach(tag => {
      // get bookmarks for the current tag, minus the one to be deleted
      let tagBookmarks = tag.bookmarks.filter(id => (id !== bookmarkId));

      // set the updated list on the tag object
      tag.bookmarks = tagBookmarks;
      // update the store
      dispatch(createOrUpdateTag(tag));
    })
    // update the bookmark's tags to remove the deleted ones
    bookmark.tags = updatedTagList;
    // update the store
    return dispatch(updateBookmark(bookmark));
  }
}

function setBookmarkFolder (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    // get folder corresponding to selected id
    chrome.bookmarks.get(id, (arr) => {
      // set it as the tagMarkerFolder
      dispatch(setFolder(arr[0]));
    })
  }
}

export default {
  'ADD_TAGS': addTags,
  'DELETE_TAGS': deleteTags,
  'SET_BOOKMARK_FOLDER': setBookmarkFolder,
};
