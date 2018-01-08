export function setFolder (folder) {
  return { type: 'SET_FOLDER', folder };
}

export function setBookmarks (data) {
  return { type: 'SET_BOOKMARKS', data };
}

export function setTags (data) {
  return { type: 'SET_TAGS', data };
}

export function createOrUpdateTag (tag) {
  return { type: 'CREATE_OR_UPDATE_TAG', tag };
}

export function updateBookmark (bookmark) {
  return { type: 'UPDATE_BOOKMARK', bookmark };
}
