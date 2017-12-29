import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Bookmark from './Bookmark';


class BookmarkList extends Component {
  constructor(props) {
    super(props);
  }

  render () {
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
}

export default BookmarkList;
