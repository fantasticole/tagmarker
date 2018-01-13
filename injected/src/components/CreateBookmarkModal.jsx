import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title,
      url: this.props.url,
    };
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
  }

  handleClickSubmit () {
    let { title, url } = this.state,
        parentId = this.props.tagMarkerFolder.id;

    chrome.bookmarks.create({ parentId, title, url }, bookmark => {
      this.props.createBookmark(bookmark);
      this.handleDeactivate();
    });
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  render () {
    let { tagMarkerFolder } = this.props;

    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='create-bookmark__header'>Add bookmark in: {tagMarkerFolder.title}</h1>
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.props.title}
          name='title'
          onChange={(e) => this.handleChange('title', e)}
          type='text'
          />
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.props.url}
          name='url'
          onChange={(e) => this.handleChange('url', e)}
          type='text'
          />
        <span className='create-bookmark__actions'>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
