import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Select from 'react-select';
import Bookmark from './Bookmark';
import FolderSelection from './FolderSelection';
import Modal from './Modal';

import ifTrue from '../utils/ifTrue';

/**
 * CreateBookmarkModal
 *
 * @param {function} addTag - function to add a tag
 * @param {function} createBookmark - function to save a bookmark
 * @param {object} tags - all tags from store
 * @param {string} title - current page title
 * @param {string} url - current page url
 */
export default class CreateBookmarkModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      creatingFolder: false,
      newFolderName: null,
      parentId: null,
      preventClose: false,
      suggested: [],
      tagsToAdd: [],
      title: this.props.title,
      url: this.props.url,
      warn: false,
    };
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
    let { creatingFolder, newFolderName, parentId, tagsToAdd, title, url } = this.state;

    if (creatingFolder) {
      chrome.bookmarks.create({ parentId, title: newFolderName }, folder => {
        // add the folder to the store as a tag
        this.props.addTag(folder);
        // then, create the bookmark in that folder
        chrome.bookmarks.create({ parentId: folder.id, title, url }, bookmark => {
          // check to see if any of the tagsToAdd include our new folder name
          tagsToAdd = tagsToAdd.map(idOrName => {
            // if the id isn't a number, check it against new folder name
            if (isNaN(idOrName)) {
              // if the name is the same as the folder's title, return its id
              return idOrName === folder.title ? folder.id : idOrName;
            }
            return idOrName;
          })
          this.props.createBookmark(bookmark, tagsToAdd);
          this.handleDeactivate();
        });
      });
    }
    else {
      chrome.bookmarks.create({ parentId, title, url }, bookmark => {
        this.props.createBookmark(bookmark, tagsToAdd);
        this.handleDeactivate();
      });
    }
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  handleSelectFolder(id) {
    // if the id is not a number
    if (isNaN(id)) {
      // store the name and render parent folder selection
      this.setState({
        creatingFolder: true,
        newFolderName: id,
      });
    }
    // otherwise, hide it and set the selected parent id
    else {
      this.setState({ creatingFolder: false });
      this.setParent(id);
    }
    this.triggerCancelBuffer();
  }

  setParent (parentId) {
    let { tags } = this.props,
        { creatingFolder, newFolderName } = this.state,
        parent = tags[parentId],
        // if we have an id, get suggestions, otherwise return none
        suggested = parentId ? [ ...parent.parents, parent.id ] : [];

    // if we're creating a folder, include newFolderName in suggestions
    if (creatingFolder) suggested.push(newFolderName)

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
    let { creatingFolder, parentId, suggested, tagsToAdd, title, url, warn } = this.state,
        { tags } = this.props,
        cancelText = warn ? 'Yes, bye' : 'Cancel',
        canSubmit = url && parentId && tagsToAdd.length,
        warningClasses = classNames('modal__warning', {
          visible: warn,
        });

    return (
      <Modal.Modal className='bookmark-modal' ref='modal'>
        <h1 className='modal__header bookmark__header'>Add bookmark in:</h1>
        <FolderSelection
          creatable
          onSelect={(selected) => this.handleSelectFolder(selected)}
          parentId={parentId}
          />
        {ifTrue(creatingFolder).render(() => (
          <span>
            <p  className='modal__text'>where should this folder live?</p>
            <FolderSelection
              onSelect={(selected) => this.setParent(selected)}
              />
          </span>
        ))}
        <Bookmark
          isEditing={true}
          onChange={(field, event) => this.handleChange(field, event)}
          selected={tagsToAdd}
          setSelectedTags={(selected) => this.setSelectedTags(selected)}
          suggested={suggested}
          tags={tags}
          title={title}
          url={url}
          />
        <p className={warningClasses}>Are you sure you want to cancel?</p>
        <span className='modal__actions bookmark-modal__actions'>
          <button className='button modal-action__button bookmark-action__button action-button' disabled={!canSubmit} onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button modal-action__button bookmark-action__button action-button' onClick={() => this.handleClickCancel()}>{cancelText} <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
