import BookmarkList from '../components/BookmarkList';

import { connect } from 'react-redux';

/**
 * Maps store actions to component props.
 *
 * @param {function} dispatch - Store dispatch
 * @returns {object} Props for the connected component to dispatch actions
 */
const mapDispatchToProps = (dispatch) => {
  return {
    selectBookmark: (id) => {dispatch({ type: 'SELECT_BOOKMARK', id })},
  };
}


export default connect(null, mapDispatchToProps)(BookmarkList);
