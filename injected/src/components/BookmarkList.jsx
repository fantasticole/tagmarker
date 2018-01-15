import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Bookmark from '../containers/Bookmark';


export default class BookmarkList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='bookmark-list__container'>
        <h1 className='drawer__header bookmarks__header'>Bookmarks</h1>
        {
          this.props.filteredBookmarks.length ?
          <ul className='tagmarker-list bookmark-list'>
            {this.props.filteredBookmarks.map(bookmarkId => (
              <Bookmark
                id={bookmarkId}
                key={bookmarkId}
                />
            ))}
          </ul> :
          <p className='bookmark__list-is_empty'>no bookmarks to display</p>
        }
      </div>
    )
  }
}
