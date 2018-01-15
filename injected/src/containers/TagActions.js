import TagActions from '../components/TagActions';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  let { filtered, sort, tags } = state,
      filteredTags = filtered.map(id => tags[id]);

  return {
    ascending: sort.ascending,
    sortBy: sort.sortBy,
    filteredTags,
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
    onSort: (sort) => {dispatch({ type: 'SET_SORT', sort })},
    selectTag: (id) => {dispatch({ type: 'SELECT_TAG', id })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagActions);
