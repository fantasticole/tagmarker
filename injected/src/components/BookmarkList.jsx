import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkListItem from '../containers/BookmarkListItem';


export default class BookmarkList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='bookmark-list__container'>
        <div className='drawer__header tags__header'>
          <h1 className='drawer__header-text'>Bookmarks</h1>
        </div>
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
