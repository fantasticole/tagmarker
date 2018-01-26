import {
  createOrUpdateBookmark,
  createOrUpdateTags,
  filterBookmarksAndTags,
  updateFilteredBookmarks,
  updateFilteredTags,
  updateSelectedTags
} from './actions';

export function createBookmark (originalAction) {
  let { bookmark, tagsToAdd } = originalAction;

  return (dispatch, getState) => {
    let { parentId } = bookmark,
        { selected, tags } = getState(),
        tagsToUpdate = getTagsToUpdate(tagsToAdd, [], tags, bookmark.id),
        // get ids to set on bookmark
        idsToAdd = tagsToUpdate.map(tag => tag.id);

    bookmark.tags = idsToAdd;
    dispatch(createOrUpdateTags(tagsToUpdate));
    dispatch(createOrUpdateBookmark(bookmark));
    // give a quarter second for the store to update, then filter
    return setTimeout(() => {
      dispatch(filterBookmarksAndTags(selected));
    }, 250)
  }
}

export function createFolder (originalAction) {
  let { folder } = originalAction;

  return (dispatch, getState) => {
    let { selected, tags } = getState(),
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
    // give a quarter second for the store to update, then filter
    return setTimeout(() => {
      dispatch(filterBookmarksAndTags(selected));
    }, 250)
  }
}

export function createTag (title, tags, bookmarkId) {
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

export function deselectTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        selectedTags = [...selected],
        // find ids index in selected tags array
        index = selectedTags.indexOf(id);

    selectedTags.splice(index, 1);
    // update the store
    dispatch(updateSelectedTags(selectedTags));
    // update filtered tags and bookmarks based on updated selections
    return dispatch(filterBookmarksAndTags(selectedTags));
  }
}

export function getTagsToUpdate (tagsToAdd, tagsToDelete, allTags, bookmarkId) {
  let tagsToUpdate = [];

  // add bookmark to each tag
  tagsToAdd.forEach(id => {
    let updatedTag = Object.assign({}, allTags[id]);

    // if the tag exists, add the bookmark id to its bookmarks
    if (updatedTag.hasOwnProperty('title')) {
      updatedTag.bookmarks = [...updatedTag.bookmarks, bookmarkId];
    }
    // otherwise, create the tag and add the id on creation
    else updatedTag = createTag(id, allTags, bookmarkId);
    // add tag to list of tags to update
    tagsToUpdate.push(updatedTag);
  });

  tagsToDelete.forEach(id => {
    // get the tag to update
    let updatedTag = Object.assign({}, allTags[id]),
        // filter bookmark ids for the ones to keep
        newBookmarks = updatedTag.bookmarks.filter(bId => bId !== bookmarkId);

    // set the new bookmarks
    updatedTag.bookmarks = newBookmarks;
    // add tag to list of tags to update
    tagsToUpdate.push(updatedTag);
  });

  return tagsToUpdate;
}

export function removeBookmark (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, filteredBookmarks, tags } = getState(),
        bookmark = bookmarks[id],
        bookmarkIndex = filteredBookmarks.indexOf(id),
        tagsToDelete = bookmark.tags,
        tagsToUpdate = getTagsToUpdate([], tagsToDelete, tags, id),
        newFilteredBookmarks = [...filteredBookmarks];

    // update the store
    dispatch(createOrUpdateTags(tagsToUpdate));
    // if the bookmark being deleted is in the filtered array, remove it
    if (bookmarkIndex > -1) {
      newFilteredBookmarks.splice(bookmarkIndex, 1);
      dispatch(updateFilteredBookmarks(newFilteredBookmarks));
    }
    // delete bookmark from store
    return dispatch({ type: 'DELETE_BOOKMARK', id });
  }
}

export function removeTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, filteredTags, selected, tags } = getState(),
        tag = tags[id],
        // get a list of bookmarks with updated tags
        bookmarksToUpdate = tag.bookmarks.map(bId => {
          let bookmark = bookmarks[bId],
              // filter out the tag id that's being deleted
              updatedTags = {
                tags: bookmark.tags.filter(tId => tId !== id),
              };

          // return a new bookmark object
          return Object.assign({}, bookmark, updatedTags);
        });

    // remove the tag id from each bookmark associated with it
    bookmarksToUpdate.forEach(bookmarkObj => {
      dispatch(createOrUpdateBookmark(bookmarkObj));
    })
    // if the tag was selected, deselect it
    if (selected.includes(id)) {
      dispatch(updateSelectedTags(selected.filter(tId => tId !== id)));
    }
    // if the tag was in the filtered list, remove it
    if (filteredTags.includes(id)) {
      dispatch(updateFilteredTags(filteredTags.filter(tId => tId !== id)));
    }
    // delete tag from store
    return dispatch({ type: 'DELETE_TAG', id });
  }
}

export function selectBookmark (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // get tags associated with selected bookmark
        { tags } = bookmarks[id],
        // filter for those not selected
        filteredTags = tags.filter(id => !selected.includes(id));

    dispatch(updateFilteredTags(filteredTags));
    return dispatch(updateFilteredBookmarks([id]));
  }
}

export function selectTag (originalAction) {
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

export function updateBookmark (originalAction) {
  let { bookmark } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, selected, tags } = getState(),
        oldTags = bookmarks[bookmark.id].tags,
        // figure out which tags are being added
        tagsToAdd = bookmark.tags.filter(t => (!oldTags.includes(t))),
        // and which are being deleted
        tagsToDelete = oldTags.filter(t => (!bookmark.tags.includes(t))),
        // get the tag objects for each to update
        tagsToUpdate = getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmark.id),
        // get the newly created ids
        tagIds = bookmark.tags.map(idOrTitle => {
          // if the tag exists, return the id
          if (tags[idOrTitle]) return idOrTitle;
          // otherwise it's a title
          else {
            // so find the newly created tag and return its id
            return tagsToUpdate.find(tag => tag.title === idOrTitle).id;
          }
        });

    bookmark.tags = tagIds;
    dispatch(createOrUpdateTags(tagsToUpdate));
    dispatch(createOrUpdateBookmark(bookmark));
    // give a quarter second for the store to update, then filter
    return setTimeout(() => {
      dispatch(filterBookmarksAndTags(selected));
    }, 250)
  }
}

export default {
  'CREATE_BOOKMARK': createBookmark,
  'CREATE_FOLDER': createFolder,
  'DESELECT_TAG': deselectTag,
  'REMOVE_BOOKMARK': removeBookmark,
  'REMOVE_TAG': removeTag,
  'SELECT_BOOKMARK': selectBookmark,
  'SELECT_TAG': selectTag,
  'UPDATE_BOOKMARK': updateBookmark,
};
