import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Loader from './Loader';

import Modal from './Modal';

import ifTrue from '../utils/ifTrue';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFolders: [],
      folderRoot: {},
      selected: this.props.tagMarkerFolder.id,
    };
  }

  componentDidMount () {
    this.loadFolders();
  }

  handleAddFolder (parentId, title) {
    // this.renderModal();
    console.log('add folder in:', parentId);
    chrome.bookmarks.search({ title }, arr => {
      let folder = arr.filter(f => f.id === parentId),
           modalContainer = document.getElementsByClassName('modal-container')[0];

      ReactDOM.render(
        <Modal className="create-folder-modal">
          <h1>Add folder in: {folder.title}</h1>
        </Modal>,
        modalContainer
      );
    })
    // this.props.setBookmarkFolder(folder);
  }

  handleClickCancel () {
    console.log('Exit!')
  }

  handleClickSave () {
    console.log('Save!')
  }

  handleClickFolder (e, id) {
    let { activeFolders } = this.state;

    // stop click from bubbling up
    e.stopPropagation();
    // see if the folder is already active
    if (activeFolders.includes(id)) {
      // deactivate it
      activeFolders.splice(activeFolders.indexOf(id), 1);
    }
    // otherwise, make it active
    else { activeFolders.push(id) }

    // update the state
    this.setState({ activeFolders });
  }

  handleSelectFolder (selected) {
    this.setState({ selected });
    // TODO: add dispatch to props
    // this.props.dispatch({ action: 'SET_FOLDER', folder });
  }

  loadFolders () {
    chrome.bookmarks.getTree(arr => {
      this.setState({ folderRoot: arr[0] });
    })
  }

  renderChildren (childNode) {
    let { children, id, title } = childNode,
        nodeClasses = ['folder-node'];

    if (this.state.activeFolders.includes(id)) nodeClasses.push('active');
    // if the node is a folder
    if (children) {
      // see if any of the children are folders
      let childFolders = children.filter(c => c.hasOwnProperty('children'));

      // return a list item for the node and list its children
      return (
        <li className={nodeClasses.join(' ')} key={id}>
          <span className='folder-name'>
            <span onClick={e => this.handleClickFolder(e, id)}>
              {ifTrue(childFolders.length).render(() => (<i className='fa fa-caret-right show-more'/>))}
              {title}
            </span>
            <span className='folder-actions'>
              <input
                checked={this.state.selected === id}
                onChange={() => this.handleSelectFolder(id)}
                title='select folder'
                type='radio'
                value={id}
                />
                <button className='button add-folder' onClick={() => {this.handleAddFolder(id, title)}} title='add folder'  type='button'><i className='fa fa-plus-circle'/></button>
            </span>
          </span>
          <ul className='folder-list'>{children.map(child => this.renderChildren(child))}</ul>
        </li>
      )
    }
  }

  // render the user's bookmark folders
  renderFolders () {
    return (
      <form>
        <ul className='folder-list root-list'>
          {this.state.folderRoot.children.map(child => this.renderChildren(child))}
        </ul>
      </form>
    )
  }

  render () {
    console.log('this:', this)
    return (
      <div className='drawer__content settings'>
        <h1 className='drawer__header settings__header'>Settings</h1>
        <div className='settings__content'>
          <p className='settings__text'>Where do you want to save new bookmarks and tags?</p>
          {this.state.folderRoot.children ?
            this.renderFolders() : <Loader />
          }
          <button className='button settings-action__button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button settings-action__button' onClick={() => this.handleClickCancel()}>Cancel <i className='fa fa-ban'/></button>
        </div>
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
    setBookmarkFolder: (folder) => {dispatch({ type: 'SET_FOLDER', folder })},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);