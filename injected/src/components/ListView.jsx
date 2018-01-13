import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import BookmarkList from '../containers/BookmarkList';
import TagList from '../containers/TagList';

export default class ListView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      filteredBookmarks: [],
    };
  }

  componentDidMount () {
    this.filterBookmarks();
  }

  componentDidUpdate (prevProps) {
    let { selectedTags } = this.props,
        { filteredBookmarks } = this.state,
        // if the number of selected tags changes
        selectedChanged = prevProps.selectedTags.length !== selectedTags.length,
        // or if the selected tags' bookmark count changes
        filterBookmarks = selectedTags.some(tagId => {
          return prevProps.tags[tagId].bookmarks.length !== this.props.tags[tagId].bookmarks.length;
        });

    // update the bookmarks
    if (selectedChanged || filterBookmarks) this.filterBookmarks();
  }

  filterBookmarks () {
    let { bookmarks, selectedTags, tags } = this.props,
        filteredBookmarks = Object.values(bookmarks).filter(b => {
          return selectedTags.every((id) => b.tags.includes(id));
        }).map(bookmark => bookmark.id);

    this.setState({ filteredBookmarks });
  }

  render () {
    let { filteredBookmarks } = this.state;

    return (
      <div className='drawer__content lists'>
        <TagList />
        <BookmarkList selectedBookmarks={filteredBookmarks} />
      </div>
    );
  }
}
