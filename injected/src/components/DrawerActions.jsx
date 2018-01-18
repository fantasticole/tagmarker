import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ifTrue from '../utils/ifTrue';

/**
 * DrawerActions
 *
 * @param {bool} folderIsSet - whether we have a default folder to save to
 * @param {strong} view - current drawer view
 */
export default class DrawerActions extends Component {
  constructor (props) {
    super(props);
  }

  handleAddBookmark () {
    // send message to add a bookmark
    chrome.runtime.sendMessage({ ref: 'add_bookmark' });
  }

  handleCloseDrawer () {
    // send message to close the drawer
    chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
  }

  render() {
    return (
      <div className='drawer-actions'>
        <button className='button drawer-close' onClick={() => this.handleCloseDrawer()} title='close drawer'>&raquo;</button>
        <button className='button add-bookmark' onClick={() => this.handleAddBookmark()} title='add bookmark'>+</button>
      </div>
    )
  }
}
