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
    selectedTags: state.selected,
    tags: state.tags,
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
  };
}

export default connect(mapStateToProps)(ListView);
// export default connect(mapStateToProps, mapDispatchToProps)(ListView);