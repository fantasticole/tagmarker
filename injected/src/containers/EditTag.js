import EditTag from '../components/EditTag';

import { connect } from 'react-redux';


/**
 * Maps store actions to component props.
 *
 * @param {function} dispatch - Store dispatch
 * @returns {object} Props for the connected component to dispatch actions
 */
const mapDispatchToProps = (dispatch) => {
  return {
    removeTag: (id) => {
      dispatch({ type: 'REMOVE_TAG', id });
    },
    updateTag: (tag) => {
      dispatch({ type: 'UPDATE_TAG_NAME', tag });
    },
  };
}

export default connect(null, mapDispatchToProps)(EditTag);
