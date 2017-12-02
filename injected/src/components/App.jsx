import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTags: [],
    };
  }

  handleClickTag (id) {
    let { selectedTags } = this.state;

    selectedTags.push(id);
    this.setState({ selectedTags });
  }

  handleCloseDrawer () {
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: false });
  }

  handleOpenDrawer () {
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: true });
  }

  render() {
    let tagNames = this.props.tags ? Object.values(this.props.tags) : [],
        containerClasses = ['tags-container'];

    if (this.props.drawerOpen) containerClasses.push('open')

    return (
      <div className={containerClasses.join(' ')}>
        <div className='drawer'>
          <button className='drawer-close' onClick={() => this.handleCloseDrawer()}>&raquo;</button>
          <div className='selected-tags'>
            {this.state.selectedTags.map(tagId => (
              <p key={tagId}>{this.props.tags[tagId].title}</p>
            ))}
          </div>
          <div className='tag-list'>
            <ul>
              {tagNames.map(tag => {
                let tagClasses = ['tag'];

                if (this.state.selectedTags.indexOf(tag.id) > -1) {
                  tagClasses.push('selected');
                }
                return (
                  <li className={tagClasses.join(' ')} key={tag.id} onClick={() => this.handleClickTag(tag.id)}>
                    {tag.title} [{tag.bookmarks.length}]
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
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
