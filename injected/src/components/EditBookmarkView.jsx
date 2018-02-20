import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Alert from './Alert';
import EditBookmark from './EditBookmark';
import FolderSelection from './FolderSelection';
import Modal from './Modal';
import Select from 'react-select';

import ifTrue from '../utils/ifTrue';

/**
 * EditBookmarkView
 *
 * @param {object} bookmark - bookmark object we're managing
 * @param {function} closeBookmark - function to close bookmark edit view
 * @param {function} onEdit - function to alert the parent to edits
 * @param {array} selected - selected tags for the bookmark
 * @param {array} suggested - suggested tags for the bookmark
 * @param {object} tags - all tags from store
 * @param {bool} update - whether we're updating or creating a bookmark
 * @param {function} updateBookmark - function to update a bookmark
 */
export default class EditBookmarkView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      creatingFolder: false,
      newFolderName: null,
      parentId: this.props.bookmark.parentId,
      suggested: this.props.suggested ? this.props.suggested : [],
      tagsToAdd: this.props.selected ? this.props.selected : [],
      title: this.props.bookmark.title,
      url: this.props.bookmark.url,
      validUrl: true,
      warn: false,
    };
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value, warn: true });
    this.props.onEdit();
  }

  handleClickCancel () {
    if (this.state.warn) {
      Alert('exit without saving?', 'confirm exit', 'yes, exit', 'keep editing').then(isConfirmed => {
        if (isConfirmed) {
          this.props.closeBookmark();}
      });
    }
    else this.props.closeBookmark();
  }

  handleClickSubmit () {
    let { bookmark, update } = this.props,
        { creatingFolder, newFolderName, parentId, tagsToAdd, title, url } = this.state,
        // check the validity of the url
        validUrl = this.refs.bookmark.refs.url.checkValidity();

    // if the url is invalid
    if (!validUrl) {
      // set that on the state
      this.setState({ validUrl });
      // stop submission process
      return;
    }

    // see if we're creating a folder
    if (creatingFolder) {
      chrome.bookmarks.create({ parentId, title: newFolderName }, folder => {
          // check to see if any of the tagsToAdd include our new folder name
          tagsToAdd = tagsToAdd.map(idOrName => {
            // if the id isn't a number, check it against new folder name
            if (isNaN(idOrName)) {
              // if the name is the same as the folder's title, return its id
              return idOrName === folder.title ? folder.id : idOrName;
            }
            return idOrName;
          })

          // if we're updating
          if (update) {
            // create updated bookmark object to pass along
            let newBookmark = Object.assign({}, bookmark, { parentId: folder.id, title, tags: tagsToAdd, url });

            // update the bookmark in the store
            this.updateBookmark(newBookmark);
          }
          // otherwise, create a bookmark in that folder
          else {
            chrome.bookmarks.create({ parentId: folder.id, title, url }, bm => {
              bm.tags = tagsToAdd;
              // update the bookmark in the store
              this.updateBookmark(bm);
            });
          }
        })
    }
    // if we're not creating a folder
    else {
      // if we're updating the bookmark
      if (update) {
        // create updated bookmark object to pass along
        let newBookmark = Object.assign({}, bookmark, { parentId, title, url });

        // update the bookmark in the store
        this.updateBookmark(newBookmark);
      }
      // otherwise
      else {
        // create the bookmark
        chrome.bookmarks.create({ parentId, title, url }, bm => {
          bm.tags = tagsToAdd;
          // update the bookmark in the store
          this.updateBookmark(bm);
        });
      }
    }
  }

  handleSelectFolder(id) {
    // if the id is not a number
    if (isNaN(id)) {
      // store the name and render parent folder selection
      this.setState({
        creatingFolder: true,
        newFolderName: id,
        warn: true,
      });
    }
    // otherwise, hide it and set the selected parent id
    else {
      this.setState({ creatingFolder: false, warn: true });
      this.setParent(id);
    }
    this.props.onEdit();
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
    this.setState({ tagsToAdd, warn: true, });
    this.props.onEdit();
  }

  updateBookmark (bookmark) {
    this.props.updateBookmark(bookmark);
    this.props.closeBookmark();
  }

  render () {
    let { creatingFolder, parentId, suggested, tagsToAdd, title, url, validUrl } = this.state,
        { tags, update } = this.props,
        canSubmit = url && parentId && tagsToAdd.length,
        bookmarkClasses = classNames('bookmark-modal__bookmark', {
          'has-errors': !validUrl,
        }),
        action = update ? 'update' : 'add';

    return (
      <div className={bookmarkClasses}>
        <h1 className='modal__header bookmark__header'>{action} bookmark in:</h1>
        <FolderSelection
          creatable
          onSelect={(selected) => this.handleSelectFolder(selected)}
          parent={tags[parentId]}
          />
        {ifTrue(creatingFolder).render(() => (
          <span>
            <p  className='modal__text'>where should this folder live?</p>
            <FolderSelection
              onSelect={(selected) => this.setParent(selected)}
              />
          </span>
        ))}
        <EditBookmark
          onChange={(field, event) => this.handleChange(field, event)}
          selected={tagsToAdd}
          setSelectedTags={(selected) => this.setSelectedTags(selected)}
          suggested={suggested}
          tags={tags}
          title={title}
          ref='bookmark'
          url={url}
          />
        <span className='modal__actions bookmark-modal__actions'>
          <button className='button modal-action__button bookmark-action__button action-button' disabled={!canSubmit} onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button modal-action__button bookmark-action__button action-button' onClick={() => this.handleClickCancel()}>Exit <i className='fa fa-ban'/></button>
        </span>
      </div>
    );
  }
}
