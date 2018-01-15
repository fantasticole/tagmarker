import { combineReducers } from 'redux';

export function bookmarks (state = {}, action) {
  console.log('action:', action)
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'CREATE_OR_UPDATE_BOOKMARK':
      // get updated object holding all of the bookmarks
      let updated = action.bookmarks;

      // return the whole object
      return updated;
    default:
      return state;
  }
};

export function filtered (state = [], action) {
  switch (action.type) {
    case 'UPDATE_FILTERED_TAGS':
      let filteredTags = [...action.tags];

      return filteredTags;
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

export function sort (state = {}, action) {
  switch (action.type) {
    case 'SET_SORT':
      // get object holding current sort state
      let updated = Object.assign({}, state);

      // if sortBy stays the same, just change the direction
      if (action.sort === state.sortBy) {
        updated.ascending = !state.ascending;
      }
      else {
        // otherwise, update sortBy and set default direction
        updated.sortBy = action.sort;
        updated.ascending = true;
      }

      return updated;
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
  filtered,
  selected,
  sort,
  tagMarkerFolder,
  tags,
});
