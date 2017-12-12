import { combineReducers } from 'redux';

export function bookmarks (state = [], action) {
  console.log('action:', action)
  console.log('state:', state)
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    case 'UPDATE_BOOKMARK':
      console.log('UPDATE_BOOKMARK!');
      return state;
    default:
      return state;
  }
};

export function tags (state = {}, action) {
  switch (action.type) {
    case 'SET_TAGS':
      return action.data;
    case 'UPDATE_TAG':
      console.log('UPDATE_TAG!');
      return state;
    // case 'CREATE_TAG':
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

export default combineReducers({
  bookmarks,
  drawerOpen: toggleDrawer,
  tags,
});
