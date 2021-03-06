import { combineReducers } from 'redux';
import initialState from './initialState';

export function bookmarks (state = {}, action) {
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'CREATE_OR_UPDATE_BOOKMARKS':
      // get object holding all of the bookmarks
      let updated = Object.assign({}, state);

      // create or update each bookmark that we're being passed
      action.bookmarks.forEach(bookmark => {
        updated[bookmark.id] = bookmark;
      })
      // return all of the bookmarks
      return updated;
    case 'DELETE_BOOKMARK':
      let updatedState = Object.assign({}, state);

      delete updatedState[action.id];
      return updatedState;
    default:
      return state;
  }
};

export function spreadsheet (state = {}, action) {
  switch (action.type) {
    case 'SET_SPREADSHEET':
      return action.data;
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
    case 'DELETE_TAG':
      let updatedState = Object.assign({}, state);

      delete updatedState[action.id];
      return updatedState;
    default:
      return state;
  }
};

export default combineReducers({
  bookmarks,
  spreadsheet,
  tags,
});
