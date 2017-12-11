import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import BookmarkList from './BookmarkList';
import TagList from './TagList';

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // highlighted: [],
      selectedTags: [],
      selectedBookmarks: [],
    };
  }

  componentDidMount () {
    this.loadBookmarks();
  }

  handleAddBookmark () {
    console.log('add!');
  }

  handleClickTag (id) {
    let { selectedTags } = this.state,
        tagIndex = selectedTags.indexOf(id);

    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);
    this.setState({ selectedTags });
    this.loadBookmarks();
  }

  handleCloseDrawer () {
    // update the store
    this.props.dispatch({ type: 'TOGGLE_DRAWER', data: false });
    // send update to the background to pass along to the container
    chrome.runtime.sendMessage({ ref: 'drawer', msg: 'close_drawer' });
  }

  loadBookmarks () {
    if (this.props.bookmarks) {
      let { bookmarks, tags } = this.props,
          { selectedTags } = this.state,
          // get all bookmarks associated with current tags
          filteredBookmarks = selectedTags.reduce((arr, id) => {
            // filter tag's bookmarks array for duplicates
            let additions = tags[id].bookmarks.filter(bookmark => (
              // return item if not already in arr
              arr.indexOf(bookmark) < 0
            ));
            // add unique ids to arr
            return arr.concat(additions)
          // }, []);
          }, []),
          selectedBookmarks = filteredBookmarks.map(id => (
            // get the bookmark object for each id
            bookmarks.find(bookmark => (bookmark.id === id))
          ));

      this.setState({ selectedBookmarks });
      console.log('selectedTags:', selectedTags);
      console.log('selectedBookmarks:', selectedBookmarks)
    }
  }

  render () {
    return (
      <div className='drawer'>
        <div className='actions'>
          <button className='button drawer-close' onClick={() => this.handleCloseDrawer()}>&raquo;</button>
          <button className='button add-bookmark' onClick={() => this.handleAddBookmark()}>+</button>
        </div>
        <div className='lists'>
          <TagList
            handleClickTag={(id) => this.handleClickTag(id)}
            selectedTags={this.state.selectedTags}
            />
          <BookmarkList
            selectedBookmarks={this.state.selectedBookmarks}
            />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    drawerOpen: state.drawerOpen,
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(Drawer);
