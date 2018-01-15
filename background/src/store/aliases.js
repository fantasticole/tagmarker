import {
  createOrUpdateBookmark,
  createOrUpdateTags,
  filterTags,
  setFilteredTags,
  setFolder,
  updateFilteredTags,
  updateSelectedTags
} from './actions';

function addTags (originalAction) {
  let { bookmarkId, tagIds } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tagMarkerFolder, tags } = getState(),
        // get bookmark object to add from
        bookmark = bookmarks[bookmarkId],
        // TODO: make sure there is always a folder chosen
        tagMarkerFolderId = tagMarkerFolder.id ? tagMarkerFolder.id : "1",
        tagPromises = tagIds.map(id => (createTag(tags, id, bookmark, tagMarkerFolder.id)));

    Promise.all(tagPromises).then(tagsToUpdate => {
      let idsToAdd = tagsToUpdate.map(t => (t.id));

      // update the bookmark's tags to add the new ones
      bookmark.tags = bookmark.tags.concat(idsToAdd);
      dispatch(createOrUpdateTags(tagsToUpdate));
      return dispatch(createOrUpdateBookmark(bookmark));
    });
  }
}

function createBookmark (originalAction) {
  let { bookmark } = originalAction;

  return (dispatch, getState) => {
    let { parentId } = bookmark,
        { tags } = getState(),
        tagsToAdd = [],
        tagsToUpdate = [];

    // gather all parent tags up to bookmarks root
    while (parentId > 0) {
      tagsToAdd.push(parentId);
      parentId = tags[parentId];
    }

    // add bookmark to each tag
    tagsToAdd.forEach(id => {
      let updatedTag = tags[id];

      updatedTag.bookmarks.push(bookmark.id);

      tagsToUpdate.push(updatedTag);
    })

    bookmark.tags = tagsToAdd;
    dispatch(createOrUpdateTags(tagsToUpdate));
    return dispatch(createOrUpdateBookmark(bookmark));
  }
}

function createFolder (originalAction) {
  let { folder } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState(),
        { dateAdded, dateGroupModified, id, parentId, title } = folder,
        parents = [...tags[parentId].parents, parentId],
        newTag = {
          dateAdded,
          dateGroupModified,
          id,
          parentId,
          parents,
          title,
          bookmarks: [],
        };  

    // updates tags
    dispatch(createOrUpdateTags([newTag]));
  }
}

function createTag (tags, tagId, bookmark, tagMarkerFolderId) {
  let tagToUpdate = tags[tagId];

  // if we have a tag for the id already
  if (tagToUpdate) {
    // add the bookmark's id to the tag's bookmarks array
    tagToUpdate.bookmarks.push(bookmark.id);
    return tagToUpdate;
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
          bookmarks: [ bookmark.id ],
        };

    return newTag;
  })
}

function deleteTags (originalAction) {
  let { bookmarkId, tagIds } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
        // get object for each tag being deleted
        tagsToDelete = tagIds.map(id => (tags[id])),
        // get bookmark object to delete from
        bookmark = bookmarks[bookmarkId],
        // get bookmark's tags that aren't in the tagIds to be deleted
        updatedTagList = bookmark.tags.filter(id => (!tagIds.includes(id))),
        tagsToUpdate = [];

    // remove the bookmark id from each tag's object
    tagsToDelete.forEach(tag => {
      // get bookmarks for the current tag, minus the one to be deleted
      let tagBookmarks = tag.bookmarks.filter(id => (id !== bookmarkId));

      // set the updated list on the tag object
      tag.bookmarks = tagBookmarks;
      // add to list of tags to update
      tagsToUpdate.push(tag);
    })
    // update the store
    dispatch(createOrUpdateTags(tagsToUpdate));
    // update the bookmark's tags to remove the deleted ones
    bookmark.tags = updatedTagList;
    // update the store
    return dispatch(createOrUpdateBookmark(bookmark));
  }
}

function removeTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // find id's index in selected tags array
        index = selected.indexOf(id),
        filteredTags;

    selected.splice(index, 1);
    // update filtered tags based on updated selections
    filteredTags = filterTags(bookmarks, selected);
    // update the store
    dispatch(updateSelectedTags(selected));
    return dispatch(updateFilteredTags(filteredTags));
  }
}

function selectTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // add id to selected tags array
        selectedTags = [...selected, id],
        // update filtered tags based on updated selections
        filteredTags = filterTags(bookmarks, selectedTags);

    // update the store
    dispatch(updateSelectedTags(selectedTags));
    return dispatch(updateFilteredTags(filteredTags));
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
  'CREATE_BOOKMARK': createBookmark,
  'CREATE_FOLDER': createFolder,
  'DELETE_TAGS': deleteTags,
  'REMOVE_TAG': removeTag,
  'SELECT_TAG': selectTag,
  'SET_BOOKMARK_FOLDER': setBookmarkFolder,
};
