import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateBookmarkModal from './CreateBookmarkModal';
import ListView from '../containers/ListView';
import Modal from './Modal';
import SettingsView from '../containers/SettingsView';

import ifTrue from '../utils/ifTrue';

export default class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarkName: '',
      bookmarkUrl: '',
      view: this.props.tagMarkerFolder.id ? 'tags' : 'settings',
    };
  }

  componentDidMount () {
    // listen for flags to open and close drawer
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.ref === 'bookmark_data') {
        this.setState({
          bookmarkName: req.data.title,
          bookmarkUrl: req.data.url,
        });
        this.renderBookmarkModal();
      }
    })
  }

  handleAddBookmark () {
    chrome.runtime.sendMessage({ ref: 'add_bookmark' });
  }

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
  }

  handleClickSettings () {
    this.setState({ view: 'settings' });
  }

  handleClickSubmit () {
    let { tagMarkerFolder } = this.props;
    // // TODO: make this into an action that
    // // - updates tags
    chrome.bookmarks.create({
      parentId: tagMarkerFolder.id,
      title: this.state.bookmarkName,
      url: this.state.bookmarkUrl,
    }, bookmark => {
      this.props.createBookmark(bookmark);
    });
  }

  handleClickTags () {
    this.setState({ view: 'tags' });
  }

  handleCloseDrawer () {
    // send message to close the drawer
    chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
  }

  renderBookmarkModal () {
    let { bookmarkName, bookmarkUrl } = this.state,
        { title } = this.props.tagMarkerFolder;

    Modal.render(<CreateBookmarkModal name={bookmarkName} url={bookmarkUrl} onChange={(key, e) => this.handleChange(key, e)} onSubmit={() => this.handleClickSubmit()} title={title} />);
  }

  renderActions () {
    let { view } = this.state;

    return (
      <div className='drawer-actions'>
        <button className='button drawer-close' onClick={() => this.handleCloseDrawer()} title='close drawer'>&raquo;</button>
        {ifTrue(this.props.tagMarkerFolder.id).render(() => (
          // only render add bookmark button if we have a place to put it
          <button className='button add-bookmark' onClick={() => this.handleAddBookmark()} title='add bookmark'>+</button>
        ))}
        {ifTrue(this.props.tagMarkerFolder.id && view === 'settings').render(() => (
          // only render button to leave settings if we have a folder set
          <button className='button show-tags' onClick={() => this.handleClickTags()} title='show tags'><i className='fa fa-list'/></button>
        ))}
        {ifTrue(view === 'tags').render(() => (
          <button className='button show-settings' onClick={() => this.handleClickSettings()} title='settings'><i className='fa fa-cog'/></button>
        ))}
      </div>
    )
  }

  render () {
    return (
      <div className='drawer'>
        <div className='container'>
          {this.renderActions()}
          {this.state.view === 'tags' ? <ListView /> : <SettingsView />}
        </div>
        <div className='modal-container' />
      </div>
    );
  }
}
