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
    let { selectedTags } = this.state,
        tagIndex = selectedTags.indexOf(id);

    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);
    this.setState({ selectedTags });
  }

  handleCloseDrawer () {
    // update the store
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: false });
    // send update to the background to pass along to the container
    chrome.runtime.sendMessage({ ref: 'drawer', msg: 'close_drawer' });
  }

  render() {
    let tagNames = this.props.tags ? Object.values(this.props.tags) : [];

    return (
      <div className='tags-container'>
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
