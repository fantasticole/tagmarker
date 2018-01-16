import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateBookmarkModal from './CreateBookmarkModal';
import DrawerActions from './DrawerActions';
import ListView from './ListView';
import Modal from './Modal';
import SettingsView from '../containers/SettingsView';

export default class Drawer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      view: this.props.tagMarkerFolder.id ? 'tags' : 'settings',
    };
  }

  componentDidMount () {
    // listen for flags to open and close drawer
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.ref === 'bookmark_data') {
        let { title, url } = req.data,
            { tagMarkerFolder, createBookmark } = this.props;

        Modal.render(
          <CreateBookmarkModal
            createBookmark={(bookmark) => createBookmark(bookmark)}
            tagMarkerFolder={tagMarkerFolder}
            tags={this.props.tags}
            title={title}
            url={url}
            />
        );
      }
    })
  }

  toggleView () {
    // get the current view
    let current = this.state.view,
        // set the new view to the only other option
        view = current === 'tags' ? 'settings' : 'tags';

    this.setState({ view });
  }

  render () {
    return (
      <div className='drawer'>
        <div className='container'>
          <DrawerActions
            folderIsSet={this.props.tagMarkerFolder.id > -1}
            toggleView={() => this.toggleView()}
            view={this.state.view}
            />
          {this.state.view === 'tags' ? <ListView /> : <SettingsView />}
        </div>
        <div className='modal-container' />
      </div>
    );
  }
}
