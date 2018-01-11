import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Lists from './Lists';
import Modal from './Modal';
import Settings from './Settings';

import ifTrue from '../utils/ifTrue';

class Drawer extends Component {
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

  handleClickSubmit (parentId) {
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
    this.handleDeactivate();
  }

  handleClickTags () {
    this.setState({ view: 'tags' });
  }

  handleCloseDrawer () {
    // send message to close the drawer
    chrome.runtime.sendMessage({ ref: 'toggle_drawer' });
  }

  handleDeactivate () {
    ReactDOM.unmountComponentAtNode(document.getElementsByClassName('modal-container')[0]);
  }

  renderBookmarkModal () {
    let { title } = this.props.tagMarkerFolder,
        modalContainer = document.getElementsByClassName('modal-container')[0];

    ReactDOM.render(
      <Modal className='create-bookmark-modal'>
        <h1 className='create-bookmark__header'>Add bookmark in: {title}</h1>
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.state.bookmarkName}
          name='name'
          onChange={(e) => this.handleChange('bookmarkName', e)}
          type='text'
          />
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.state.bookmarkUrl}
          name='url'
          onChange={(e) => this.handleChange('bookmarkUrl', e)}
          type='text'
          />
        <span className='create-bookmark__actions'>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal>,
      modalContainer
    );
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
          {this.state.view === 'tags' ? <Lists /> : <Settings />}
        </div>
        <div className='modal-container' />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tagMarkerFolder: state.tagMarkerFolder,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDrawer: () => {dispatch({ type: 'TOGGLE_DRAWER', data: false })},
    createBookmark: (bookmark) => {dispatch({ type: 'CREATE_BOOKMARK', bookmark })},
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
