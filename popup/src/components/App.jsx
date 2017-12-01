import React, {Component} from 'react';
import { connect } from 'react-redux';

import logToConsole from '../../utils/logToConsole';

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleClick () {
    let drawerOpen = !this.props.drawerOpen;

    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: drawerOpen });
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
