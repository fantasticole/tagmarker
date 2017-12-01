import { combineReducers } from 'redux';

import { setBookmarks, setTags, toggleDrawer } from './reducers';

export default combineReducers({
  bookmarks: setBookmarks,
  drawerOpen: toggleDrawer,
  tags: setTags,
});