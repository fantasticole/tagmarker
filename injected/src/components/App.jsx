import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleCloseDrawer () {
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: false });
  }

  handleOpenDrawer () {
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: true });
  }

  render() {
    if (this.props.drawerOpen) {
      let tagNames = this.props.tags ? Object.values(this.props.tags) : [];

      return (
        <div>
          <button onClick={() => this.handleCloseDrawer()}>x</button>
          <ul>
            {tagNames.map(tag => (<li key={tag.id}>{tag.title}</li>))}
          </ul>
        </div>
      );
    }
    return (
      <button onClick={() => this.handleOpenDrawer()}>Show Tags</button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    drawerOpen: state.drawerOpen,
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(App);
