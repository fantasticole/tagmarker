export function initialize (data) {
  return (dispatch, getState) => {
    // set initial tags and bookmarks
    dispatch(setBookmarks(data.bookmarks));
    dispatch(setTags(data.tags));
  };
}

export function createOrUpdateBookmark (bookmark) {
  return { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark };
}

export function createOrUpdateTags (tags) {
  return { type: 'CREATE_OR_UPDATE_TAGS', tags: [...tags] };
}

export function setBookmarks (data) {
  return { type: 'SET_BOOKMARKS', data };
}

export function setTags (data) {
  return { type: 'SET_TAGS', data };
}
