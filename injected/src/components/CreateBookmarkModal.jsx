import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Select from 'react-select';
import EditableTags from './EditableTags';
import FolderSelection from './FolderSelection';
import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      parentId: this.props.tagMarkerFolder.id,
      preventClose: false,
      suggested: [],
      tagsToAdd: [],
      title: this.props.title,
      url: this.props.url,
      warn: false,
    };
  }

  componentDidMount () {
    this.setParent(this.props.tagMarkerFolder.id);
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
    this.triggerCancelBuffer();
  }

  handleClickCancel () {
    let { preventClose } = this.state;
    // check for changes
    if (preventClose) this.setState({ preventClose: false, warn: true });
    else this.handleDeactivate();
  }

  handleClickSubmit () {
    let { parentId, tagsToAdd, title, url } = this.state;

    chrome.bookmarks.create({ parentId, title, url }, bookmark => {
      this.props.createBookmark(bookmark, tagsToAdd);
      this.handleDeactivate();
    });
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  handleSelectFolder(id) {
    this.triggerCancelBuffer();
    this.setParent(id);
  }

  setParent (parentId) {
    let { tags } = this.props,
        parent = tags[parentId],
        // if we have an id, get suggestions, otherwise return none
        suggested = parentId ? [ ...parent.parents, parent.id ] : [];

    // set the new parent in the state
    this.setState({ parentId, suggested });
  }

  setSelectedTags (tagsToAdd) {
    this.setState({ tagsToAdd });
    this.triggerCancelBuffer();
  }

  triggerCancelBuffer () {
    this.setState({ preventClose: true, warn: false })
  }

  render () {
    let { parentId, suggested, warn } = this.state,
        cancelText = warn ? 'Yes, bye' : 'Cancel',
        warningClasses = classNames('modal__warning', {
          visible: warn,
        });

    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='modal__header create-bookmark__header'>Add bookmark in:</h1>
        <FolderSelection
          onSelect={(selected) => this.handleSelectFolder(selected.value)}
          parentId={parentId}
          />
        <input
          autoFocus
          className='create-bookmark__input modal__input'
          defaultValue={this.props.title}
          name='title'
          onChange={(e) => this.handleChange('title', e)}
          placeholder='bookmark name'
          type='text'
          />
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.props.url}
          name='url'
          onChange={(e) => this.handleChange('url', e)}
          placeholder='url'
          type='text'
          />
        <EditableTags
          selectTags={(tags) => this.setSelectedTags(tags)}
          suggested={suggested}
          tags={this.props.tags}
          />
        <p className={warningClasses}>Are you sure you want to cancel?</p>
        <span className='modal__actions create-bookmark__actions'>
          <button className='button modal-action__button create-bookmark-action__button action-button' disabled={!parentId} onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button modal-action__button create-bookmark-action__button action-button' onClick={() => this.handleClickCancel()}>{cancelText} <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
