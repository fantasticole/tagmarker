export function initialize (data) {
  return (dispatch, getState) => {
    dispatch(setBookmarks(data.bookmarks));
    dispatch(setTags(data.tags));
    dispatch(updateFilteredTags(Object.keys(data.tags)));
  };
}

export function createOrUpdateBookmark (bookmark) {
  return { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark };
}

export function createOrUpdateTags (tags) {
  return { type: 'CREATE_OR_UPDATE_TAGS', tags: [...tags] };
}

export function setFolder (folder) {
  return { type: 'SET_FOLDER', folder };
}

export function setBookmarks (data) {
  return { type: 'SET_BOOKMARKS', data };
}

export function setTags (data) {
  return { type: 'SET_TAGS', data };
}

export function updateFilteredTags (tags) {
  return { type: 'UPDATE_FILTERED_TAGS', tags };
}

export function updateSelectedTags (tags) {
  return { type: 'UPDATE_SELECTED_TAGS', tags };
}
