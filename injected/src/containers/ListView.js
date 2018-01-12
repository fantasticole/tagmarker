import ListView from '../components/ListView';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(ListView);
