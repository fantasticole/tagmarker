import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFolders: [],
      folderRoot: {},
    };
  }

  componentDidMount () {
    this.loadFolders();
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

  handleSelectFolder (id) {
    console.log('selected:', id);
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
      // return a list item for the node and list its children
      return (
        <li className={nodeClasses.join(' ')} key={id} onClick={e => this.handleClickFolder(e, id)}><i className='fa fa-caret-right'/> {title}
          <ul className='folder-list'>{children.map(child => this.renderChildren(child))}</ul>
        </li>
      )
    }
  }

  // render the user's bookmark folders
  renderFolders () {
    return (
      <ul className='folder-list root-list'>
        {this.state.folderRoot.children.map(child => this.renderChildren(child))}
      </ul>
    )
  }

  render () {
    return (
      <div className='drawer-content settings'>
        <h1 className='settings__header'>Settings</h1>
        <div className='settings-content'>
          <p className='settings__text'>Where do you want to save your new bookmarks and tags?</p>
          {this.state.folderRoot.children ?
            this.renderFolders() : <div className='loader' />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(Settings);
