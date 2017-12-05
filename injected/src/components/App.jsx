import React, { Component } from 'react';
import { connect } from 'react-redux';

import Marquee from './Marquee';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTags: [],
      selectedBookmarks: [],
    };
  }

  componentDidMount () {
    this.loadBookmarks();
  }

  handleClickTag (id) {
    let { selectedTags } = this.state,
        tagIndex = selectedTags.indexOf(id);

    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);
    this.setState({ selectedTags });
    console.log('selectedTags length:', selectedTags.length)
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

  render() {
    let tagNames = this.props.tags ? Object.values(this.props.tags) : [],
        sortedTagNames = tagNames.sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        });

    console.log('this.props:', this.props)
    return (
      <div className='drawer'>
        <button className='drawer-close' onClick={() => this.handleCloseDrawer()}>&raquo;</button>
        <ul className='tagmarker-list tag-list'>
          {sortedTagNames.map(tag => {
            let tagClasses = ['tag'];

            if (this.state.selectedTags.indexOf(tag.id) > -1) {
              tagClasses.push('selected');
            }
            return (
              <li className='tag-item' key={tag.id} onClick={() => this.handleClickTag(tag.id)}>
                <Marquee>
                  <p className={tagClasses.join(' ')}>
                    {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
                  </p>
                </Marquee>
              </li>
            );
          })}
        </ul>
        <ul className='tagmarker-list bookmark-list'>
          {this.state.selectedBookmarks.map(bookmark => {
            let tagNames = bookmark.tags.map(tagId => (this.props.tags[tagId].title))
            return (<li className='bookmark' key={bookmark.id}>
              <a href={bookmark.url} title={tagNames.join(', ')}>{bookmark.title}</a>
            </li>);
          })}
        </ul>
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

export default connect(mapStateToProps)(App);
