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
        let { data, drawerWasOpen, suggestedTags, update } = req,
            { manageTagAndBookmark, createBookmark, tags, updateBookmark } = this.props,
            manageBookmark = update ? updateBookmark : createBookmark,
            closeDrawer = drawerWasOpen === undefined ? drawerWasOpen : (!drawerWasOpen),
            bookmarkData = {
              bookmark: data,
              selected: data.tags,
              suggested: suggestedTags,
              update,
            };

        Modal.render(
          <ManageBookmarkModal
            manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
            manageBookmark={(...args) => manageBookmark(...args)}
            data={bookmarkData}
            onCloseModal={() => this.handleModalClose(closeDrawer)}
            tags={tags}
            />
        );
      }
    })
  }

  handleModalClose (closeDrawer) {
    // if we should close the drawer, send message to do so
    if (closeDrawer) chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
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
