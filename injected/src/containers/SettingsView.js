import SettingsView from '../components/SettingsView';

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
    setBookmarkFolder: (id) => {dispatch({ type: 'SET_BOOKMARK_FOLDER', id })},
    createFolder: (title, parentId) => {dispatch({ type: 'CREATE_FOLDER', title, parentId })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
