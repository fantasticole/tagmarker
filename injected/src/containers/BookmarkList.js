import BookmarkList from '../components/BookmarkList';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */

const mapStateToProps = (state) => {
  let { filteredBookmarks, bookmarks } = state;

  return {
    bookmarks,
    filtered: filteredBookmarks,
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
    selectBookmark: (id) => {dispatch({ type: 'SELECT_BOOKMARK', id })},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(BookmarkList);
