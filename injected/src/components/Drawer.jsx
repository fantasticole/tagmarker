import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';
import TagList from './TagList';

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: [],
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

  handleHighlight (bookmark) {
    this.setState({ highlighted: bookmark.tags });
  }

  handleStopHighlight () {
    this.setState({ highlighted: [] });
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

  render() {
    return (
      <div className='drawer'>
        <div className='actions'>
          <button className='drawer-close' onClick={() => this.handleCloseDrawer()}>&raquo;</button>
          <button className='add-bookmark' onClick={() => this.handleAddBookmark()}>+</button>
        </div>
        <div className='lists'>
          <TagList
            handleClickTag={(id) => this.handleClickTag(id)}
            highlighted={this.state.highlighted}
            selectedTags={this.state.selectedTags}
            />
          <ul className='tagmarker-list bookmark-list'>
            {this.state.selectedBookmarks.map(bookmark => (
              <li className='bookmark' key={bookmark.id}>
                <MarqueeWrapper>
                  <a
                    href={bookmark.url}
                    onMouseEnter={() => this.handleHighlight(bookmark)}
                    onMouseLeave={() => this.handleStopHighlight()}
                    title={bookmark.title}
                    >
                    {bookmark.title}
                  </a>
                </MarqueeWrapper>
              </li>
            ))}
          </ul>
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
