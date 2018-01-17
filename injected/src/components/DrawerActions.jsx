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
    let { folderIsSet, view } = this.props;

    return (
      <div className='drawer-actions'>
        <button className='button drawer-close' onClick={() => this.handleCloseDrawer()} title='close drawer'>&raquo;</button>
        {ifTrue(folderIsSet).render(() => (
          // only render add bookmark button if we have a place to put it
          <button className='button add-bookmark' onClick={() => this.handleAddBookmark()} title='add bookmark'>+</button>
        ))}
        {ifTrue(folderIsSet && view === 'settings').render(() => (
          // only render button to leave settings if we have a folder set
          <button className='button show-tags' onClick={() => this.props.toggleView()} title='show tags'><i className='fa fa-list'/></button>
        ))}
        {ifTrue(view === 'tags').render(() => (
          <button className='button show-settings' onClick={() => this.props.toggleView()} title='settings'><i className='fa fa-cog'/></button>
        ))}
      </div>
    )
  }
}
