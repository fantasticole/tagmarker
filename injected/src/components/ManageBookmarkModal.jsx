import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Alert from './Alert';
import EditBookmarkView from './EditBookmarkView';
import Modal from './Modal';

/**
 * ManageBookmarkModal
 *
 * @param {function} closeBookmark - function to close single bookmark edit view
 * @param {object} data - data for bookmark object we're managing
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
  }

  handleCloseModal () {
    let bCount = this.props.data.length,
        bNoun = bCount === 1 ? 'bookmark' : `${bCount} bookmarks`;

    Alert(`stop editing ${bNoun}?`, 'confirm close', 'yes, close', 'keep editing').then(isConfirmed => {
      if (isConfirmed) this.props.onCloseModal();
    });
  }

  render () {
    let { data, tags, updateBookmark } = this.props;

    return (
      <Modal.Modal className='bookmark-modal' onClose={() => this.handleCloseModal()} ref='modal'>
        {data.map(bookmarkData => {
          let { bookmark, id, selected, suggested, update } = bookmarkData;

          return (
            <EditBookmarkView
              bookmark={bookmark}
              closeBookmark={() => this.handleCloseBookmark(id)}
              key={id}
              updateBookmark={(bookmark) => updateBookmark(bookmark)}
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
