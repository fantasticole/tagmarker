import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateBookmarkModal from './CreateBookmarkModal';
import DrawerActions from './DrawerActions';
import ListView from '../containers/ListView';
import Modal from './Modal';

/**
 * Drawer
 *
 * @param {function} addTag - function to add a tag
 * @param {function} createBookmark - function to save a bookmark
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
        let { title, url } = req.data,
            { createTagAndBookmark, createBookmark, tags } = this.props;

        Modal.render(
          <CreateBookmarkModal
            createTagAndBookmark={(folder, bookmark, tagsToAdd) => createTagAndBookmark(folder, bookmark, tagsToAdd)}
            createBookmark={(bookmark, tagsToAdd) => createBookmark(bookmark, tagsToAdd)}
            tags={tags}
            title={title}
            url={url}
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
