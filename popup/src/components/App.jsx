import React, { Component } from 'react';
import { connect } from 'react-redux';

// import logToConsole from '../../utils/logToConsole';

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleClick () {
    let drawerOpen = !this.props.drawerOpen,
        action = drawerOpen ? 'open' : 'close';

    // update the store
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: drawerOpen });
    // send update to the background to pass along to the container
    chrome.runtime.sendMessage({ ref: 'drawer', msg: `${action}_drawer` });
  }

  render() {
    return (
      <div>
        <h1>Tags!</h1>
        <button onClick={() => this.handleClick()}>toggle drawer</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    drawerOpen: state.drawerOpen,
  };
}

export default connect(mapStateToProps)(App);
