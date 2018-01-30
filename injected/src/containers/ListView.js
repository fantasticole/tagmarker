import ListView from '../components/ListView';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state, ownProps) => {
  let { bookmarks, tags } = state;

  return {
    bookmarks,
    tags,
  };
}

export default connect(mapStateToProps)(ListView);
