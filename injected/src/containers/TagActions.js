import TagActions from '../components/TagActions';

import { connect } from 'react-redux';

/**
 * Maps data from the store state to component props.
 *
 * @param {object} state - Store.getState() result to select data from
 * @returns {object} Map of state data to component props.
 */
const mapStateToProps = (state) => {
  let { filteredTags, sort, tags } = state,
      tagObjects = filteredTags.map(id => tags[id]);

  return {
    ascending: sort.tags.ascending,
    sortBy: sort.tags.sortBy,
    filteredTags: tagObjects,
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
    onSort: (sort) => {dispatch({ type: 'SET_SORT', list: 'tags', sort })},
    selectTag: (id) => {dispatch({ type: 'SELECT_TAG', id })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagActions);
