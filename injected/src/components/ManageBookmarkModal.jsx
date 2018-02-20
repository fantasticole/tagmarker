import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Alert from './Alert';
import EditBookmarkView from './EditBookmarkView';
import Modal from './Modal';

/**
 * ManageBookmarkModal
 *
 * @param {function} closeBookmark - function to close single bookmark edit view
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

  handleCloseBookmark (id) {
    this.props.closeBookmark(id);
    // if we're closing the only bookmark, deactivate the modal
    if (this.props.data.length === 1) this.refs.modal.deactivate();
  }

  handleCloseModal () {
    let bCount = this.props.data.length,
        bNoun = bCount === 1 ? 'bookmark' : `${bCount} bookmarks`;

    Alert(`stop editing ${bNoun}?`, 'confirm close', 'yes, close', 'keep editing').then(isConfirmed => {
      if (isConfirmed) {
        this.props.onCloseModal();
        this.refs.modal.deactivate();
      }
    });
  }

  render () {
    let { createBookmark, data, tags, updateBookmark } = this.props;

    return (
      <Modal.Modal className='bookmark-modal' onClose={() => this.handleCloseModal()} ref='modal'>
        {data.map(bookmarkData => {
          let { bookmark, id, selected, suggested, update } = bookmarkData,
              manageBookmark = update ? updateBookmark : createBookmark;

          return (
            <EditBookmarkView
              bookmark={bookmark}
              closeBookmark={() => this.handleCloseBookmark(id)}
              key={id}
              manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
              manageBookmark={(...args) => manageBookmark(...args)}
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
