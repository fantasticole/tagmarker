import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditBookmarkView from './EditBookmarkView';
import Modal from './Modal';

/**
 * ManageBookmarkModal
 *
 * @param {function} createBookmark - function to save a bookmark
 * @param {object} data - data for bookmark object we're managing
 * @param {function} manageTagAndBookmark - function to add tag and manage
 * a bookmark
 * @param {function} onCloseModal - function to run when modal closes
 * @param {object} tags - all tags from store
 * @param {function} updateBookmark - function to update a bookmark
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
    let { createBookmark, data, tags, updateBookmark } = this.props;

    return (
      <Modal.Modal className='bookmark-modal' onClose={() => this.props.onCloseModal()} ref='modal'>
        {data.map(bookmarkData => {
          let { bookmark, selected, suggested, update } = bookmarkData,
              manageBookmark = update ? updateBookmark : createBookmark;

          return (
            <EditBookmarkView
              bookmark={bookmark}
              key={bookmark.id}
              manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
              manageBookmark={(...args) => manageBookmark(...args)}
              onDeactivate={() => this.handleDeactivate(bookmark.id)}
              selected={selected}
              suggested={suggested}
              tags={tags}
              update={update}
              />
          );
        })
      }
      </Modal.Modal>
    );
  }
}
