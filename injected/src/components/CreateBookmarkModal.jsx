import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';
import EditableTags from './EditableTags';
import FolderSelection from './FolderSelection';
import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addedTags: [],
      parentId: this.props.tagMarkerFolder.id,
      suggested: [],
      tagsToAdd: [],
      title: this.props.title,
      url: this.props.url,
    };
  }

  componentDidMount () {
    this.setParent(this.props.tagMarkerFolder.id);
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
  }

  handleClickSubmit () {
    let { addedTags, parentId, tagsToAdd, title, url } = this.state,
        tags = [...addedTags, ...tagsToAdd];

    chrome.bookmarks.create({ parentId, title, url }, bookmark => {
      this.props.createBookmark(bookmark, tags);
      this.handleDeactivate();
    });
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  setParent (parentId) {
    let { tags } = this.props,
        parent = tags[parentId],
        // if we have an id, get suggestions, otherwise return none
        suggested = parentId ? [ ...parent.parents, parent.id ] : [];

    // set the new parent in the state
    this.setState({ parentId, suggested });
  }

  render () {
    let { parentId, suggested } = this.state;

    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='modal__header create-bookmark__header'>Add bookmark in:</h1>
        <FolderSelection
          onSelect={(selected) => this.setParent(selected.value)}
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
          suggested={suggested}
          tags={this.props.tags}
          />
        <span className='modal__actions create-bookmark__actions'>
          <button className='button modal-action__button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button modal-action__button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
