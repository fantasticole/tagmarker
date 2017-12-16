import { proxyStore } from '../injected';

export function addTags (bookmarkId, tagIds) {
  let bookmarks = proxyStore.state.bookmarks,
      // get bookmark object to add from
      bookmark = bookmarks.find(b => (b.id === bookmarkId)),
      tagPromises = tagIds.map(id => (createTag(id, bookmarkId)));

  Promise.all(tagPromises).then(idsToAdd => {
    // update the bookmark's tags to add the new ones
    bookmark.tags = bookmark.tags.concat(idsToAdd);
    proxyStore.dispatch(updateBookmark(bookmark));
  });
}

function createTag (tagId, bookmarkId) {
  let tags = proxyStore.state.tags,
      tagToUpdate = tags[tagId];

  // if we have a tag for the id already
  if (tagToUpdate) {
    // add the bookmark's id to the tag's bookmarks array
    tagToUpdate.bookmarks.push(bookmarkId);
    // update the tag in the store
    proxyStore.dispatch(createOrUpdateTag(tagToUpdate));
    return tagId;
  }
  // otherwise, create a folder for the new tag
  // inside of the tagmarker folder
  return new Promise((resolve, reject) => {
    chrome.bookmarks.create({
      parentId: proxyStore.state.tagMarkerFolder.id,
      title: tagId
    }, resolve);
  }).then(folder => {
    // add the folder we just created to the store as a tag
    // with the bookmark as an item in its bookmarks array
    let  { dateAdded, dateGroupModified, id, parentId, parents, title } = folder,
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
    proxyStore.dispatch(createOrUpdateTag(newTag));
    return id;
  })
}

function createOrUpdateTag (tag) {
  return { type: 'CREATE_OR_UPDATE_TAG', tag };
}

export function deleteTags (bookmarkId, tagIds) {
  let tags = proxyStore.state.tags,
      bookmarks = proxyStore.state.bookmarks,
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
    proxyStore.dispatch(createOrUpdateTag(tag));
  })
  // update the bookmark's tags to remove the deleted ones
  bookmark.tags = updatedTagList;
  // update the store
  proxyStore.dispatch(updateBookmark(bookmark));
}

function updateBookmark (bookmark) {
  return { type: 'UPDATE_BOOKMARK', bookmark };
}
