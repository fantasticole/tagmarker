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
        updatedBookmarks = Object.assign({}, bookmarks, { [bookmark.id]: bookmark });

    // update the bookmark in the store as well as filteredTags
    dispatch({ type: 'CREATE_OR_UPDATE_BOOKMARK', bookmarks: updatedBookmarks });
    return dispatch(filterBookmarksAndTags(selected));
  };
}

export function createOrUpdateTags (tags) {
  return { type: 'CREATE_OR_UPDATE_TAGS', tags: [...tags] };
}

export function filterBookmarksAndTags (selectedTags) {
  return (dispatch, getState) => {
    let { bookmarks, tags } = getState();

    // if we have tags selected, filter bookmarks and tags
    if (selectedTags) {
      // look at each bookmark object
      let filteredBookmarks = Object.values(bookmarks).filter(b => {
            // include it if every selected tag is in its tags array
            return selectedTags.every((id) => b.tags.includes(id));
          }),
          // get a list of all of the filtered bookmarks' tags
          allTags = filteredBookmarks.reduce((tags, bookmark) => {
            return tags.concat(bookmark.tags);
          }, []),
          // get a unique list of those tags
          relatedTags = Array.from(new Set(allTags)).filter(id => {
            // excluding those already selected
            return !selectedTags.includes(id);
          });

      dispatch(updateFilteredBookmarks(filteredBookmarks));
      dispatch(updateFilteredTags(relatedTags));
    }
    else {
      dispatch(updateFilteredBookmarks(Object.values(bookmarks)));
      dispatch(updateFilteredTags(Object.values(tags)));
    }
  }
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

export function updateFilteredBookmarks (bookmarks) {
  return { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks };
}

export function updateFilteredTags (tags) {
  return { type: 'UPDATE_FILTERED_TAGS', tags };
}

export function updateSelectedTags (tags) {
  return { type: 'UPDATE_SELECTED_TAGS', tags };
}
