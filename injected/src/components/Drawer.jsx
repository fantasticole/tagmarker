import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateBookmarkModal from './CreateBookmarkModal';
import DrawerActions from './DrawerActions';
import ListView from './ListView';
import Modal from './Modal';

/**
 * Drawer
 *
 * @param {function} createBookmark - function save bookmark
 * @param {object} tagMarkerFolder - default folder for new bookmarks
 */
export default class Drawer extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // listen for flags to open and close drawer
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.ref === 'bookmark_data') {
        let { title, url } = req.data,
            { tagMarkerFolder, createBookmark } = this.props;

        Modal.render(
          <CreateBookmarkModal
            createBookmark={(bookmark, tags) => createBookmark(bookmark, tags)}
            tagMarkerFolder={tagMarkerFolder}
            tags={this.props.tags}
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
      </div>
    );
  }
}
