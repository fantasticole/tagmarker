import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import DrawerActions from './DrawerActions';
import ListView from '../containers/ListView';
import ManageBookmarkModal from './ManageBookmarkModal';
import Modal from './Modal';

/**
 * Drawer
 *
 * @param {object} tags - all tags from store
 * @param {function} updateBookmark - function to update a bookmark
 */
export default class Drawer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      bookmarks: [],
      closeDrawer: null,
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
            // see if the bookmark is already in our bookmarks array
            // (only matters when updating)
            index = bookmarks.findIndex(b => b.bookmark.id === data.id),
            bookmarkData = {
              bookmark: data,
              // set the id as a timestamp to be used as a key
              // also makes sure bookmark updates get displayed
              id: Date.now(),
              selected: data.tags,
              suggested: suggestedTags,
              update,
            };

        // if we're updating a bookmark and it's already in our array
        if (update && index > -1) {
          // merge the new information in
          bookmarks[index] = Object.assign(bookmarks[index], bookmarkData);
        }
        // otherwise, add the new data to the end
        else bookmarks.push(bookmarkData);

        // if closeDrawer hasn't been set yet, set it
        if (closeDrawer === null) {
          closeDrawer = drawerWasOpen === undefined ? drawerWasOpen : (!drawerWasOpen);
        }

        this.setState({ bookmarks, closeDrawer })
      }
      // if we're being alerted that a bookmark has been removed
      else if (req.ref === 'remove_bookmark') {
        let { bookmarks } = this.state,
            index = bookmarks.findIndex(b => b.bookmark.id === req.id);

        // if it's in our bookmarks array
        if (index > -1) {
          // remove it
          bookmarks.splice(index, 1);
          // if we have bookmarks, update the state, otherwise, manage the drawer
          bookmarks.length ? this.setState({ bookmarks }) : this.handleDrawerClose();
        };
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.bookmarks.length) {
      let { tags, updateBookmark } = this.props;

      Modal.render(
        <ManageBookmarkModal
          closeBookmark={(id) => this.handleCloseBookmark(id)}
          data={this.state.bookmarks}
          onCloseModal={() => this.handleDrawerClose()}
          tags={tags}
          updateBookmark={(bookmark) => updateBookmark(bookmark)}
          />
      );
    }
  }

  handleCloseBookmark (id) {
    // filter the closed bookmark out of the bookmarks on the state
    let bookmarks = this.state.bookmarks.filter(b => b.id !== id);

    // if we have bookmarks, update the state, otherwise, manage the drawer
    bookmarks.length ? this.setState({ bookmarks }) : this.handleDrawerClose();
  }

  handleDrawerClose () {
    Modal.deactivate();
    // if we should close the drawer, send message to do so
    if (this.state.closeDrawer) chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
    // reset the state
    this.setState({ bookmarks: [], closeDrawer: null });
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
