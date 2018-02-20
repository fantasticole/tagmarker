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
 * @param {object} tags - all tags from store
 * @param {function} updateBookmark - function to update a bookmark
 */
export default class Drawer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bookmarks: [],
    }
  }

  componentDidMount () {
    // listen for flags to add bookmark
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      // if we're being sent bookmark data, add it to the state
      if (req.ref === 'bookmark_data') {
        // I don't understand why req.data has tags for manually
        // created bookmarks
        let { bookmarks, closeDrawer } = this.state,
            { data, drawerWasOpen, suggestedTags, update } = req,
            bookmarkData = {
              bookmark: data,
              selected: data.tags,
              suggested: suggestedTags,
              update,
            };

        // if closeDrawer hasn't been set yet, set it
        if (!this.state.hasOwnProperty('closeDrawer')) {
          closeDrawer = drawerWasOpen === undefined ? drawerWasOpen : (!drawerWasOpen);
        }

        bookmarks.push(bookmarkData);
        this.setState({ bookmarks, closeDrawer })
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.bookmarks.length) {
      let { manageTagAndBookmark, createBookmark, tags, updateBookmark } = this.props;

      Modal.render(
        <ManageBookmarkModal
          createBookmark={(bookmark, tagsToAdd) => createBookmark(bookmark, tagsToAdd)}
          data={this.state.bookmarks}
          manageTagAndBookmark={(...args) => manageTagAndBookmark(...args)}
          onCloseModal={() => this.handleModalClose()}
          tags={tags}
          updateBookmark={(bookmark) => updateBookmark(bookmark)}
          />
      );
    }
  }

  handleModalClose () {
    // if we should close the drawer, send message to do so
    if (this.state.closeDrawer) chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
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
