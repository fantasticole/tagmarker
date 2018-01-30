import { combineReducers } from 'redux';
import initialState from './initialState';

export function bookmarks (state = {}, action) {
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'CREATE_OR_UPDATE_BOOKMARK':
      // get updated object holding all of the bookmarks
      let updated = Object.assign({}, state, { [action.bookmark.id]: action.bookmark });

      // return the whole object
      return updated;
    case 'DELETE_BOOKMARK':
      let updatedState = Object.assign({}, state);

      delete updatedState[action.id];
      return updatedState;
    default:
      return state;
  }
};

export function filteredBookmarks (state = [], action) {
  switch (action.type) {
    case 'UPDATE_FILTERED_BOOKMARKS':
      let updatedList = [...action.bookmarks];

      return updatedList;
    default:
      return state;
  }
};

export function filteredTags (state = [], action) {
  switch (action.type) {
    case 'UPDATE_FILTERED_TAGS':
      let updatedList = [...action.tags];

      return updatedList;
    default:
      return state;
  }
};

export function selected (state = [], action) {
  switch (action.type) {
    case 'UPDATE_SELECTED_TAGS':
      let selectedTags = [...action.tags];
      
      return selectedTags;
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
  filteredBookmarks,
  filteredTags,
  selected,
  tags,
});
