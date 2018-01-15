import BookmarkList from '../components/BookmarkList';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */

const mapStateToProps = (state) => {
  return {
    filteredBookmarks: state.filteredBookmarks,
  };
}

export default connect(mapStateToProps)(BookmarkList);
