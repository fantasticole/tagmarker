export function createOrUpdateRelations (tagIds) {
  return (dispatch, getState) => {
    let { bookmarks, tags } = getState(),
        relations = [];

    // for each id to be updated
    tagIds.forEach(id => {
      // get the updated bookmarks associated with our current tag
      let bookmarkIds = tags[id].bookmarks,
          // the objects for each bookmark
          bookmarkObjects = bookmarkIds.map(id => bookmarks.find(b => b.id === id)),
          // and the updated relation
          relation = bookmarkObjects.reduce((arr, bookmark) => {
            return Array.from(new Set(arr.concat(bookmark.tags)));
          }, []);

      relations.push({ id, relation });
    });

    return dispatch({ type: 'CREATE_OR_UPDATE_RELATIONS', relations });
  }
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

export function setRelations (data) {
  return { type: 'SET_RELATIONS', data };
}

export function setTags (data) {
  return { type: 'SET_TAGS', data };
}

export function updateBookmark (bookmark) {
  return { type: 'UPDATE_BOOKMARK', bookmark };
}
