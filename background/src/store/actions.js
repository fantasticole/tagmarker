export function initialize (data) {
  return (dispatch, getState) => {
    dispatch(setBookmarks(data.bookmarks));
    dispatch(setTags(data.tags));
    dispatch(updateFilteredTags(Object.keys(data.tags)));
    dispatch({ type: 'SET_SORT', sort: 'alpha' });
  };
}

export function createOrUpdateBookmark (bookmark) {
  return (dispatch, getState) => {
    let { bookmarks, selected } = getState(),
        // get updated bookmarks to pass into filterTags function
        updatedBookmarks = Object.assign({}, bookmarks, { [bookmark.id]: bookmark }),
        filteredTags = filterTags(bookmarks, selected);

    // update the bookmark in the store as well as filteredTags
    dispatch({ type: 'CREATE_OR_UPDATE_BOOKMARK', bookmarks: updatedBookmarks });
    return dispatch(updateFilteredTags(filteredTags));
  };
}

export function createOrUpdateTags (tags) {
  return { type: 'CREATE_OR_UPDATE_TAGS', tags: [...tags] };
}

export function filterTags (allBookmarks, selectedTags) {
  let bookmarks = Object.values(allBookmarks),
      filteredBookmarks = bookmarks.filter(b => {
        return selectedTags.every((id) => b.tags.includes(id));
      }),
      allTags = filteredBookmarks.reduce((tags, bookmark) => {
        return tags.concat(bookmark.tags);
      }, []),
      relatedTags = Array.from(new Set(allTags)).filter(id => {
        return !selectedTags.includes(id);
      });

  return relatedTags;
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
