import {
  createOrUpdateBookmark,
  createOrUpdateTags,
  filterBookmarksAndTags,
  setFolder,
  updateSelectedTags
} from './actions';

function createBookmark (originalAction) {
  let { bookmark, tagsToAdd } = originalAction;

  return (dispatch, getState) => {
    let { parentId } = bookmark,
        { tags } = getState(),
        tagsToUpdate = getTagsToUpdate(tagsToAdd, [], tags, bookmark.id);

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

function createTag (title, tags, bookmarkId) {
  let id = Math.random().toString(36).substr(2, 9),
      newTag = {
        dateAdded: Date.now(),
        dateGroupModified: Date.now(),
        id,
        parentId: '',
        parents: [],
        title,
        bookmarks: [ bookmarkId ],
      },
      existingTag = tags[id];

  if (existingTag) {
    return createTag(title, tags, bookmarkId);
  }
  return newTag
}

function getTagsToUpdate (tagsToAdd, tagsToDelete, alltags, bookmarkId) {
  let tagsToUpdate = [];

  // add bookmark to each tag
  tagsToAdd.forEach(id => {
    let updatedTag = alltags[id];

    // if the tag exists, add the bookmark id to its bookmarks
    if (updatedTag) updatedTag.bookmarks.push(bookmarkId);
    // otherwise, create the tag and add the id on creation
    else updatedTag = createTag(id, alltags, bookmarkId);
    // add tag to list of tags to update
    tagsToUpdate.push(updatedTag);
  });

  tagsToDelete.forEach(id => {
    // get the tag to update
    let updatedTag = alltags[id],
        // find the index of the bookmark to remove
        bookmarkIndex = updatedTag.bookmarks.indexOf(bookmarkId);

    // splice the bookmark id out
    updatedTag.bookmarks.splice(bookmarkIndex, 1);
    // add tag to list of tags to update
    tagsToUpdate.push(updatedTag);
  })

  return tagsToUpdate;
}

function removeTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // find id's index in selected tags array
        index = selected.indexOf(id);

    selected.splice(index, 1);
    // update the store
    dispatch(updateSelectedTags(selected));
    // update filtered tags and bookmarks based on updated selections
    return dispatch(filterBookmarksAndTags(selected));
  }
}

function selectTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // add id to selected tags array
        selectedTags = [...selected, id];

    // update the store
    dispatch(updateSelectedTags(selectedTags));
    // update filtered tags and bookmarks based on updated selections
    return dispatch(filterBookmarksAndTags(selectedTags));
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

function updateBookmark (originalAction) {
  let { bookmark } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
        oldTags = bookmarks[bookmark.id].tags,
        tagsToAdd = bookmark.tags.filter(t => (!oldTags.includes(t))),
        tagsToDelete = oldTags.filter(t => (!bookmark.tags.includes(t)))
        tagsToUpdate = getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmark.id);

    dispatch(createOrUpdateTags(tagsToUpdate));
    return dispatch(createOrUpdateBookmark(bookmark));
  }
}

export default {
  'CREATE_BOOKMARK': createBookmark,
  'CREATE_FOLDER': createFolder,
  'REMOVE_TAG': removeTag,
  'SELECT_TAG': selectTag,
  'SET_BOOKMARK_FOLDER': setBookmarkFolder,
  'UPDATE_BOOKMARK': updateBookmark,
};
