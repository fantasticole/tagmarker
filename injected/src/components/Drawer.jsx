import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import DrawerActions from './DrawerActions';
import ListView from '../containers/ListView';
import ManageBookmarkModal from './ManageBookmarkModal';
import Modal from './Modal';

/**
 * Drawer
 *
 * @param {function} addTag - function to add a tag
 * @param {function} createBookmark - function to save a bookmark
 * @param {function} updateBookmark - function to update a bookmark
 * @param {object} tags - all tags from store
 */
export default class Drawer extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // listen for flags to add bookmark
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      // if we're being sent bookmark data, open modal to add bookmark
      if (req.ref === 'bookmark_data') {
        // I don't understand why req.data has tags for manually
        // created bookmarks
        let { data, suggestedTags, update } = req,
            { manageTagAndBookmark, createBookmark, tags, updateBookmark } = this.props,
            manageBookmark = update ? updateBookmark : createBookmark;

        Modal.render(
          <ManageBookmarkModal
            manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
            manageBookmark={(...args) => manageBookmark(...args)}
            bookmark={data}
            selected={data.tags}
            suggested={suggestedTags}
            tags={tags}
            update={update}
            />
        );
      }
    })
  }

  render () {
    return (
      <div className='drawer'>
        <div className='container'>
          <DrawerActions />
          <ListView />
        </div>
        <div className='modal-container' />
        <div className='alert-container' />
      </div>
    );
  }
}
