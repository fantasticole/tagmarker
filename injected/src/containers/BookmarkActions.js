import BookmarkActions from '../components/BookmarkActions';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  let { filteredBookmarks, sort, bookmarks } = state,
      bookmarkObjects = filteredBookmarks.map(id => bookmarks[id]);

  return {
    bookmarks: Object.values(bookmarks),
    ascending: sort.bookmarks.ascending,
    sortBy: sort.bookmarks.sortBy,
    filteredBookmarks: bookmarkObjects,
  };
}

/**
 * Maps store actions to component props.
 *
 * @param {function} dispatch - Store dispatch
 * @returns {object} Props for the connected component to dispatch actions
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onSort: (sort) => {dispatch({ type: 'SET_SORT', list: 'bookmarks', sort })},
    selectBookmark: (id) => {dispatch({ type: 'SELECT_BOOKMARK', id })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkActions);
