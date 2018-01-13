import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateBookmarkModal from './CreateBookmarkModal';
import DrawerActions from './DrawerActions';
import ListView from '../containers/ListView';
import Modal from './Modal';
import SettingsView from '../containers/SettingsView';

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

  handleChange (bookmarkKey, event) {
    this.setState({ [bookmarkKey]: event.target.value });
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

  toggleView () {
    let { view } = this.state,
        viewOptions = {
          tags: 'settings',
          settings: 'tags',
        };

    this.setState({ view: viewOptions[view] });
  }

  renderBookmarkModal () {
    let { bookmarkName, bookmarkUrl } = this.state,
        { title } = this.props.tagMarkerFolder;

    Modal.render(
      <CreateBookmarkModal
        name={bookmarkName}
        url={bookmarkUrl}
        onChange={(key, e) => this.handleChange(key, e)}
        onSubmit={() => this.handleClickSubmit()}
        title={title}
        />
    );
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
