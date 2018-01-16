import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import FolderSelection from './FolderSelection';
import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      addedTags: [],
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
    let { addedTags, parent, tagsToAdd, title, url } = this.state,
        parentId = parent.id,
        tags = [...addedTags, ...tagsToAdd];

    chrome.bookmarks.create({ parentId, title, url }, bookmark => {
      this.props.createBookmark(bookmark, tags);
      this.handleDeactivate();
    });
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  handleDeleteTag (id) {
    let { addedTags, tagsToAdd } = this.state,
        // find index of tag to remove
        tagIndex = tagsToAdd.indexOf(id),
        addedTagIndex = addedTags.indexOf(id);

    // if it was in tagsToAdd
    if (tagIndex > -1) {
      // remove the tag id
      tagsToAdd.splice(tagIndex, 1);
      // update the state
      this.setState({ tagsToAdd });
    }

    // if it was in tagsToAdd
    else if (addedTagIndex > -1) {
      // remove the tag id
      addedTags.splice(addedTagIndex, 1);
      // update the state
      this.setState({ addedTags });
    }
  }

  setPossibleTags (tagsToAdd) {
    // if we don't have any tags to add passed in
    if (!tagsToAdd) {
      // get all tag objects from the store
      let { tags } = this.props,
          parentId = this.state.parent.id;

      // get possible tag ideas from parent folder
      tagsToAdd = [ ...tags[parentId].parents, parentId ];
    }

    // set those in the state
    this.setState({ tagsToAdd });
  }

  updateParent (selected) {
    let { addedTags } = this.state,
        { tags } = this.props,
        parent = tags[selected.value],
        tagsToAdd = [ ...addedTags, ...parent.parents, parent.id ];

    // set the new parent in the state
    this.setState({ parent });
    // update the potential tags
    this.setPossibleTags(tagsToAdd);
  }

  renderTags () {
    let { tagsToAdd } = this.state,
        { tags } = this.props,
        tagObjects = tagsToAdd.map(id => tags[id]);

    return (
      <div className='create-bookmark__tags'>
        {tagObjects.map(tag => (
          <button className='button bookmark__button bookmark__tag bookmark__tag--is_editing' key={tag.id} onClick={() => this.handleDeleteTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
        ))}
      </div>
    );
  }

  render () {
    let { parent } = this.state;

    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='modal__header create-bookmark__header'>Add bookmark in:</h1>
        <FolderSelection onSelect={(selected) => this.updateParent(selected)} />
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
        {this.renderTags()}
        <span className='modal__actions create-bookmark__actions'>
          <button className='button modal-action__button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button modal-action__button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
