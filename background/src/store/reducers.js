import { combineReducers } from 'redux';

export function bookmarks (state = {}, action) {
  console.log('action:', action)
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'CREATE_OR_UPDATE_BOOKMARK':
      // get object holding all of the bookmarks
      let updated = Object.assign({}, state);

      // update just the item we want to change
      updated[action.bookmark.id] = action.bookmark;
      // return the whole object
      return updated;
    default:
      return state;
  }
};

export function selected (state = [], action) {
  switch (action.type) {
    case 'ADD_SELECTED_TAG':
      let added = [...state];

      // add id to the selected array
      added.push(action.id)
      return added;
    case 'REMOVE_SELECTED_TAG':
      let removed = [...state],
          // get tag id's index
          tagIndex = removed.indexOf(action.id);

      // remove id from the selected array
      removed.splice(tagIndex, 1)
      return removed;
    default:
      return state;
  }
};

export function tags (state = {}, action) {
  switch (action.type) {
    case 'SET_TAGS':
      return action.data;
    case 'CREATE_OR_UPDATE_TAGS':
      // get object holding all of the tags
      let updated = Object.assign({}, state);

      // create or update each tag that we're being passed
      action.tags.forEach(tag => {
        updated[tag.id] = tag;
      })
      // return all of the tags
      return updated;
    default:
      return state;
  }
};

export function tagMarkerFolder (state = {}, action) {
  switch (action.type) {
    case 'SET_FOLDER':
      return action.folder;
    default:
      return state;
  }
};

export default combineReducers({
  bookmarks,
  selected,
  tagMarkerFolder,
  tags,
});
