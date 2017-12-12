import { proxyStore } from '../injected';

export function addTag (data) {
  return { type: 'ADD_BOOKMARK_TAG', data };
}

export function deleteTags (bookmarkId, tagIds) {
  let { bookmarks, tags } = proxyStore.state,
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
    proxyStore.dispatch(updateTag(tag));
  })
  // update the bookmark's tags to remove the deleted ones
  bookmark.tags = updatedTagList
  // update the store
  proxyStore.dispatch(updateBookmark(bookmark));
}

export function updateBookmark (bookmark) {
  return { type: 'UPDATE_BOOKMARK', bookmark };
}

export function updateTag (tag) {
  return { type: 'UPDATE_TAG', tag };
}