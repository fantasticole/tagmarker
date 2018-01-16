import Drawer from '../components/Drawer';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  return {
    tagMarkerFolder: state.tagMarkerFolder,
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
    createBookmark: (bookmark, tagsToAdd) => {dispatch({ type: 'CREATE_BOOKMARK', bookmark, tagsToAdd })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
