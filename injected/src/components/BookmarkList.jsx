import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkListItem from '../containers/BookmarkListItem';
import BookmarkActions from '../containers/BookmarkActions';

export default class BookmarkList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='bookmark-list__container'>
        <BookmarkActions />
        {
          this.props.filteredBookmarks.length ?
          <ul className='tagmarker-list bookmark-list'>
            {this.props.filteredBookmarks.map(bookmarkId => (
              <BookmarkListItem id={bookmarkId} key={bookmarkId} />
            ))}
          </ul> :
          <p className='bookmark__list-is_empty'>no bookmarks to display</p>
        }
      </div>
    )
  }
}
