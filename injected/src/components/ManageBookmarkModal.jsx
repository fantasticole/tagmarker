import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditBookmarkView from './EditBookmarkView';
import Modal from './Modal';

/**
 * ManageBookmarkModal
 *
 * @param {object} data - data for bookmark object we're managing
 * @param {function} manageTagAndBookmark - function to add tag and manage
 * a bookmark
 * @param {function} manageBookmark - function to manage a bookmark
 * @param {function} onCloseModal - function to run when modal closes
 * @param {object} tags - all tags from store
 */
export default class ManageBookmarkModal extends Component {
  constructor (props) {
    super(props);
  }

  handleDeactivate () {
    if (this.props.onCloseModal) this.props.onCloseModal();
    this.refs.modal.deactivate();
  }

  render () {
    let { data, tags } = this.props,
        { bookmark, selected, suggested, update } = data;

    return (
      <Modal.Modal className='bookmark-modal' onClose={() => this.props.onCloseModal()} ref='modal'>
        <EditBookmarkView
          bookmark={bookmark}
          manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
          manageBookmark={(...args) => manageBookmark(...args)}
          onDeactivate={() => this.handleDeactivate(bookmark.id)}
          selected={selected}
          suggested={suggested}
          tags={tags}
          update={update}
          />
      </Modal.Modal>
    );
  }
}
