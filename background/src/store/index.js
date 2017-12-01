import { combineReducers } from 'redux';

import { count, setBookmarks, setTags } from './reducers';

export default combineReducers({
  count,
  bookmarks: setBookmarks,
  tags: setTags,
});