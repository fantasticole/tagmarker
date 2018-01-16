import Bookmark from '../components/Bookmark';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */

const mapStateToProps = (state, ownProps) => {
  return {
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
    addTags: (bookmarkId, tagIds) => {
      dispatch({ type: 'ADD_TAGS', bookmarkId, tagIds });
    },
    deleteTags: (bookmarkId, tagIds) => {
      dispatch({ type: 'DELETE_TAGS', bookmarkId, tagIds });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookmark);
