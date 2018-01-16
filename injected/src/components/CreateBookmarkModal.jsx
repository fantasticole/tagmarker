import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      parent: this.props.tagMarkerFolder,
      tagsToAdd: [],
      title: this.props.title,
      url: this.props.url,
    };
  }

  componentDidMount () {
    this.setPossibleTags();
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
  }

  handleClickSubmit () {
    let { parent, tagsToAdd, title, url } = this.state,
        parentId = parent.id;

    chrome.bookmarks.create({ parentId, title, url }, bookmark => {
      this.props.createBookmark(bookmark, tagsToAdd);
      this.handleDeactivate();
    });
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  handleDeleteTag (id) {
    let { tagsToAdd } = this.state,
        // find index of tag to remove
        tagIndex = tagsToAdd.indexOf(id);

    // remove the tag id
    tagsToAdd.splice(tagIndex, 1);
    // update the state
    this.setState({ tagsToAdd });
  }

  setPossibleTags () {
    // get all tag objects from the store
    let { tags } = this.props,
        parentId = this.state.parent.id,
        // get possible tag ideas from parent folder
        possibleTags = [ ...tags[parentId].parents, parentId ],
        // get tag objects
        tagsToAdd = possibleTags.map(id => tags[id]);

    // set those in the state
    this.setState({ tagsToAdd });
  }

  renderTags () {
    let { tagsToAdd } = this.state;

    return (
      <div className='create-bookmark__tags'>
        {tagsToAdd.map(tag => (
          <button className='button bookmark__button bookmark__tag bookmark__tag--is_editing' key={tag.id} onClick={() => this.handleDeleteTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
        ))}
      </div>
    );
  }

  render () {
    let { parent } = this.state;

    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='create-bookmark__header'>Add bookmark in: {parent.title}</h1>
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
        {this.renderTags()}
        <span className='create-bookmark__actions'>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
