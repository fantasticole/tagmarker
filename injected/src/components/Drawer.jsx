import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Lists from './Lists';
import Settings from './Settings';

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'tags',
    };
  }

  handleAddBookmark () {
    console.log('add!');
    console.log('loc:', window.location);
  }

  handleClickSettings () {
    this.setState({ view: 'settings' });
  }

  handleClickTags () {
    this.setState({ view: 'tags' });
  }

  handleCloseDrawer () {
    // update the store
    this.props.toggleDrawer();
    // send update to the background to pass along to the container
    chrome.runtime.sendMessage({ ref: 'drawer', msg: 'close_drawer' });
  }

  renderActions () {
    return (
      <div className='actions'>
        <button className='button drawer-close' onClick={() => this.handleCloseDrawer()} title='close drawer'>&raquo;</button>
        <button className='button add-bookmark' onClick={() => this.handleAddBookmark()} title='add bookmark'>+</button>
        {
          this.state.view === 'tags' ?
          <button className='button show-settings' onClick={() => this.handleClickSettings()} title='settings'><i className='fa fa-cog'/></button> :
          <button className='button show-tags' onClick={() => this.handleClickTags()} title='show tags'><i className='fa fa-list'/></button>
        }
      </div>
    )
  }

  render () {
    return (
      <div className='drawer'>
        {this.renderActions()}
        {this.state.view === 'tags' ? <Lists /> : <Settings />}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDrawer: () => {dispatch({ type: 'TOGGLE_DRAWER', data: false })},
  };
}

export default connect(null, mapDispatchToProps)(Drawer);
