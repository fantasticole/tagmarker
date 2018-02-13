import { createOrUpdateBookmarks, createOrUpdateTags } from './actions';
import * as spreadsheet from '../utils/spreadsheet';

export function addBookmark (originalAction) {
  let { bookmark, tagsToAdd } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState(),
        { allTags, tagsToCreate, tagsToUpdate } = getTagsToUpdate(tagsToAdd, [], tags, bookmark.id),
        // get ids to set on bookmark
        idsToAdd = allTags.map(tag => tag.id);

    bookmark.tags = idsToAdd;
    // update the spreadsheet
    spreadsheet.addRows('bookmarks', bookmark);
    spreadsheet.addRows('tags', tagsToCreate);
    spreadsheet.update(tagsToUpdate, 'tags', Object.keys(tags).length);
    // update the store
    dispatch(createOrUpdateTags(allTags));
    return dispatch(createOrUpdateBookmarks(bookmark));
  }
}

export function addTag (originalAction) {
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

    // update the spreadsheet
    spreadsheet.addRows('tags', newTag);
    // update the store
    return dispatch(createOrUpdateTags(newTag));
  }
}

export function createTag (title, tags, bookmarkId) {
  let id = `tm-${Math.random().toString(36).substr(2, 9)}`,
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

export function getTagsToUpdate (tagsToAdd, tagsToDelete, allTags, bookmarkId) {
  let tags = { tagsToUpdate: [], tagsToCreate: [] };

  // add bookmark to each tag
  tagsToAdd.forEach(id => {
    let updatedTag = Object.assign({}, allTags[id]);

    // if the tag exists, add the bookmark id to its bookmarks
    if (updatedTag.hasOwnProperty('title')) {
      updatedTag.bookmarks = [...updatedTag.bookmarks, bookmarkId];
      // add tag to list of tags to update
      tags.tagsToUpdate.push(updatedTag);
    }
    // otherwise, create the tag and add the id on creation
    else {
      updatedTag = createTag(id, allTags, bookmarkId);
      // add tag to list of tags to create
      tags.tagsToCreate.push(updatedTag);
    }
  });

  tagsToDelete.forEach(id => {
    // get the tag to update
    let updatedTag = Object.assign({}, allTags[id]),
        // filter bookmark ids for the ones to keep
        newBookmarks = updatedTag.bookmarks.filter(bId => bId !== bookmarkId);

    // set the new bookmarks
    updatedTag.bookmarks = newBookmarks;
    // add tag to list of tags to update
    tags.tagsToUpdate.push(updatedTag);
  });

  // get all tags
  tags.allTags = [...tags.tagsToCreate, ...tags.tagsToUpdate];
  return tags;
}

export function removeBookmark (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
        bookmark = bookmarks[id],
        tagsToDelete = bookmark.tags,
        { allTags } = getTagsToUpdate([], tagsToDelete, tags, id);

    // update the store
    dispatch(createOrUpdateTags(allTags));
    // delete bookmark from store
    return dispatch({ type: 'DELETE_BOOKMARK', id });
  }
}

export function removeTag (originalAction) {
  let { id } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
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
    dispatch(createOrUpdateBookmarks(bookmarksToUpdate));
    // delete tag from store
    return dispatch({ type: 'DELETE_TAG', id });
  }
}

export function updateBookmark (originalAction) {
  let { bookmark } = originalAction;

  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
        oldTags = bookmarks[bookmark.id].tags,
        // figure out which tags are being added
        tagsToAdd = bookmark.tags.filter(t => (!oldTags.includes(t))),
        // and which are being deleted
        tagsToDelete = oldTags.filter(t => (!bookmark.tags.includes(t))),
        // get the tag objects for each to update
        { allTags } = getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmark.id),
        // get the newly created ids
        tagIds = bookmark.tags.map(idOrTitle => {
          // if the tag exists, return the id
          if (tags[idOrTitle]) return idOrTitle;
          // otherwise it's a title
          else {
            // so find the newly created tag and return its id
            return allTags.find(tag => tag.title === idOrTitle).id;
          }
        });

    bookmark.tags = tagIds;
    dispatch(createOrUpdateTags(allTags));
    return dispatch(createOrUpdateBookmarks(bookmark));
  }
}

export default {
  'ADD_BOOKMARK': addBookmark,
  'ADD_TAG': addTag,
  'REMOVE_BOOKMARK': removeBookmark,
  'REMOVE_TAG': removeTag,
  'UPDATE_BOOKMARK': updateBookmark,
};
