import { combineReducers } from 'redux';

export function bookmarks (state = [], action) {
  console.log('action:', action)
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'UPDATE_BOOKMARK':
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
