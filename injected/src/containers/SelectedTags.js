import SelectedTags from '../components/SelectedTags';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  let tags = state.selected.map(id => (state.tags[id]));

  return {
    tags,
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
    removeTag: (id) => {dispatch({ type: 'REMOVE_TAG', id })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTags);
