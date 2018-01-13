import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import CreateFolderModal from './CreateFolderModal';
import Loader from './Loader';
import Modal from './Modal';

import ifTrue from '../utils/ifTrue';

export default class SettingsView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeFolders: [],
      folderName: '',
      folderRoot: {},
      selected: this.props.tagMarkerFolder.id,
    };
  }

  componentDidMount () {
    this.loadFolders();
  }

  handleAddFolder (parentId, title) {
    chrome.bookmarks.search({ title }, arr => {
      let folder = arr.find(f => f.id === parentId),
          title;

      if (folder) title = folder.title;
      else if (parentId === "1") title = 'Bookmarks Bar';
      else title = 'Other Bookmarks'

      Modal.render(<CreateFolderModal onChange={(e) => this.handleChange(e)} onSubmit={() => this.handleClickSubmit(parentId)} title={title} />);
    })
  }

  handleChange (event) {
    this.setState({ folderName: event.target.value });
  }

  handleClickCancel () {
    console.log('Exit!')
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

  handleClickSave () {
    this.props.setBookmarkFolder(this.state.selected);
  }

  handleClickSubmit (parentId) {
    console.log('Submit:', parentId)
    this.props.createFolder(this.state.folderName, parentId)
      .then((id) => {
        console.log('id:', id)
        this.handleSelectFolder(id);
        this.loadFolders();
      }, e => console.log);
  }

  handleSelectFolder (selected) {
    this.setState({ selected });
  }

  loadFolders () {
    chrome.bookmarks.getTree(arr => {
      this.setState({ folderRoot: arr[0] });
    })
  }

  renderChildren (childNode) {
    let { children, id, title } = childNode,
        nodeClasses = classNames('folder-node', {
          'active': this.state.activeFolders.includes(id),
        });

    // if the node is a folder
    if (children) {
      // see if any of the children are folders
      let childFolders = children.filter(c => c.hasOwnProperty('children'));

      // return a list item for the node and list its children
      return (
        <li className={nodeClasses} key={id}>
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
    return (
      <div className='drawer__content settings'>
        <h1 className='drawer__header settings__header'>Settings</h1>
        <div className='settings__content'>
          <p className='settings__text'>Where do you want to save new bookmarks and tags?</p>
          {this.state.folderRoot.children ?
            this.renderFolders() : <Loader />
          }
          <button className='button settings-action__button action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button settings-action__button action-button' onClick={() => this.handleClickCancel()}>Cancel <i className='fa fa-ban'/></button>
        </div>
      </div>
    );
  }
}
