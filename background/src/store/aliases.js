import { createOrUpdateBookmarks, createOrUpdateTags } from './actions';
import * as spreadsheet from '../utils/spreadsheet';

export function addBookmark (originalAction) {
  let { bookmark, tagsToAdd } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState(),
        { allTags, tagsToCreate, tagsToUpdate } = getTagsToUpdate(tagsToAdd, [], tags, bookmark.id),
        // get ids to set on bookmark
        idsToAdd = allTags.map(tag => tag.id);

    bookmark.tags = Array.from(new Set(idsToAdd));
    // update the spreadsheet
    spreadsheet.addRows('bookmarks', bookmark);
    if (tagsToCreate.length) spreadsheet.addRows('tags', tagsToCreate);
    if (tagsToUpdate.length) spreadsheet.update(tagsToUpdate, 'tags', Object.keys(tags).length);
    // update the store
    dispatch(createOrUpdateTags(allTags));
    return dispatch(createOrUpdateBookmarks(bookmark));
  }
}

export function addTag (originalAction) {
  let { folder } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState(),
        newTag = createTagFromFolder(tags, folder);

    // update the spreadsheet
    spreadsheet.addRows('tags', newTag);
    // update the store
    return dispatch(createOrUpdateTags(newTag));
  }
}

export function addTagAndBookmark (originalAction) {
  let { folder, update, bookmark, tagsToAdd } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState(),
        newTag = createTagFromFolder(tags, folder);

    dispatch(createOrUpdateTags(newTag));
    // update the spreadsheet
    spreadsheet.addRows('tags', newTag)
      .then(() => {
        // update the store
        if (update) dispatch(updateBookmark({ bookmark }));
        else dispatch(addBookmark({ bookmark, tagsToAdd }))
      })
      .catch((err) => console.error(err));
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

function createTagFromFolder (tags, folder) {
  let { dateAdded, dateGroupModified, id, parentId, title } = folder,
      parentTag = tags[parentId],
      parents = [...tags[parentId].parents, parentId],
      newTag = {
        dateAdded,
        dateGroupModified,
        id,
        parentId,
        title,
        bookmarks: [],
      };

  // if this folder is a child of the bookmarks bar or other bookmarks
  if (parentTag && parentTag.title === ("Bookmarks Bar" || "Other Bookmarks")) {
    // remove that parent folder's id from its 'parents' array
    parents.splice(parents.indexOf(parentId), 1);
  }

  newTag.parents = parents;
  return newTag;
}

export function getTagsToUpdate (tagsToAdd, tagsToDelete, allTags, bookmarkId) {
  let tags = { tagsToUpdate: [], tagsToCreate: [] };

  // add bookmark to each tag
  tagsToAdd.forEach(id => {
    let updatedTag = Object.assign({}, allTags[id]);

    // if the tag exists, add the bookmark id to its bookmarks
    if (updatedTag.hasOwnProperty('title')) {
      updatedTag.bookmarks = Array.from(new Set([...updatedTag.bookmarks, bookmarkId]));
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
    updatedTag.bookmarks = Array.from(new Set(newBookmarks));
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

    // update the spreadsheet
    spreadsheet.deleteRow('bookmarks', Object.keys(bookmarks).length, id);
    spreadsheet.update(allTags, 'tags', Object.keys(tags).length);
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
                tags: Array.from(new Set(bookmark.tags.filter(tId => tId !== id))),
              };

          // return a new bookmark object
          return Object.assign({}, bookmark, updatedTags);
        });

    // update the spreadsheet
    spreadsheet.deleteRow('tags', Object.keys(tags).length, id);
    spreadsheet.update(bookmarksToUpdate, 'bookmarks', Object.keys(bookmarks).length);
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
        oldBookmark = bookmarks[bookmark.id],
        titleChanged = oldBookmark.title !== bookmark.title,
        urlChanged = oldBookmark.url !== bookmark.url,
        oldTags = oldBookmark.tags,
        // figure out which tags are being added
        tagsToAdd = bookmark.tags.filter(t => (!oldTags.includes(t))),
        // and which are being deleted
        tagsToDelete = oldTags.filter(t => (!bookmark.tags.includes(t))),
        // get the tag objects for each to update or create
        { allTags, tagsToCreate, tagsToUpdate } = getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmark.id),
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

    // if the title or url changed
    if ( titleChanged || urlChanged ) {
      let { title, url } = bookmark;

      // update them with chrome
      chrome.bookmarks.update(bookmark.id, { title, url });
    }

    bookmark.tags = Array.from(new Set(tagIds));
    // update the spreadsheet
    spreadsheet.update(bookmark, 'bookmarks', Object.keys(bookmarks).length);
    if (tagsToUpdate.length) spreadsheet.update(tagsToUpdate, 'tags', Object.keys(tags).length);
    if (tagsToCreate.length) spreadsheet.addRows('tags', tagsToCreate);
    // update the store
    dispatch(createOrUpdateTags(allTags));
    return dispatch(createOrUpdateBookmarks(bookmark));
  }
}

export function updateTagName (originalAction) {
  let { tag } = originalAction;

  return (dispatch, getState) => {
    let { tags } = getState();

    // if the tag id is a number, it corresponds to a folder in chrome
    if (!isNaN(tag.id[0])) {
      let { title } = tag;

      // update the title with chrome
      chrome.bookmarks.update(tag.id, { title });
    }
    // update the spreadsheet
    spreadsheet.update(tag, 'tags', Object.keys(tags).length);
    // update the store
    dispatch(createOrUpdateTags(tag));
  }
}

export default {
  'ADD_BOOKMARK': addBookmark,
  'ADD_TAG': addTag,
  'ADD_TAG_AND_BOOKMARK': addTagAndBookmark,
  'REMOVE_BOOKMARK': removeBookmark,
  'REMOVE_TAG': removeTag,
  'UPDATE_BOOKMARK': updateBookmark,
  'UPDATE_TAG_NAME': updateTagName,
};
