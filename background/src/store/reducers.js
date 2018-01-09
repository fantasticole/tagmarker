import { combineReducers } from 'redux';

export function bookmarks (state = [], action) {
  console.log('action:', action)
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'UPDATE_BOOKMARK':
      // find the index of the object we want to update
      let index = state.findIndex(b => (b.id === action.bookmark.id)),
          // get the whole array to return
          bookmarks = [...state];

      // update just the object we want to change
      bookmarks[index] = action.bookmark;
      // return the whole list
      return bookmarks;
    default:
      return state;
  }
};

export function relations (state = {}, action) {
  switch (action.type) {
    case 'SET_RELATIONS':
      return action.data;
    case 'CREATE_OR_UPDATE_RELATIONS':
      // get object holding all of the tags
      let updated = Object.assign({}, state);

      // create or update each tag that we're being passed
      action.relations.forEach(r => {
        updated[r.id] = r.relation;
      })
      // return all of the relations
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

export function toggleDrawer (state = false, action) {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return action.data;
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
  drawerOpen: toggleDrawer,
  relations,
  tagMarkerFolder,
  tags,
});
