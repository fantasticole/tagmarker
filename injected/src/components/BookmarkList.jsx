import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Bookmark from './Bookmark';


class BookmarkList extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    if (this.props.selectedBookmarks.length) {
      return (
        <ul className='tagmarker-list bookmark-list'>
          {this.props.selectedBookmarks.map(bookmarkId => (
            <Bookmark
              id={bookmarkId}
              key={bookmarkId}
              />
          ))}
        </ul>
      );
    }
    return (
      <p className='bookmark__list-is_empty'>no bookmarks to display</p>
    )
  }
}

export default BookmarkList;
