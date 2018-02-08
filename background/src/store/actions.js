export function initialize (data) {
  return (dispatch, getState) => {
    // set initial tags and bookmarks
    dispatch(setBookmarks(data.bookmarks));
    dispatch(setTags(data.tags));
  };
}

export function createOrUpdateBookmarks (bookmarks) {
  if (!Array.isArray(bookmarks)) bookmarks = [ bookmarks ];
  return { type: 'CREATE_OR_UPDATE_BOOKMARKS', bookmarks };
}

export function createOrUpdateTags (tags) {
  if (!Array.isArray(tags)) tags = [ tags ];
  return { type: 'CREATE_OR_UPDATE_TAGS', tags };
}

export function setBookmarks (data) {
  return { type: 'SET_BOOKMARKS', data };
}

export function setTags (data) {
  return { type: 'SET_TAGS', data };
}
