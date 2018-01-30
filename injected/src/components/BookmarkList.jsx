import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkListItem from '../containers/BookmarkListItem';
import BookmarkActions from './BookmarkActions';

/**
 * BookmarkList
 *
 * @param {object} bookmarks - all bookmarks from store
 * @param {function} filtered - list of bookmark ids
 * @param {function} selectBookmark - function to run when bookmark is selected
 */
export default class BookmarkList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ascending: true,
      sortBy: 'date',
    };
  }

  handleSort (sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ ascending: !this.state.ascending });
    }
    else {
      this.setState({ sortBy, ascending: true });
    }
  }

  sort () {
    let { ascending, sortBy } = this.state;

    return (a, b) => {
      // make the sort direction dynamic
      let num = ascending ? -1 : 1,
          aProp,
          bProp;

      switch (sortBy) {
        // if we're sorting alphabetically,
        case 'alpha':
          // let the prop be the title
          aProp = a.title.toLowerCase();
          bProp = b.title.toLowerCase();
          break;
        // if by date
        case 'date':
          // the the dateAdded
          aProp = a.dateAdded;
          bProp = b.dateAdded;
      }

      if (aProp < bProp) return num;
      if (aProp > bProp) return -num;
      // if the props are the same, sort them alphabetically
      if (sortBy !== 'alpha' && aProp === bProp) {
        return a.title.toLowerCase() < b.title.toLowerCase() ? num : -num;
      }
      return 0;
    }
  }

  render () {
    let { ascending, sortBy } = this.state,
        { bookmarks, filtered, selectBookmark } = this.props,
        filteredBookmarks = filtered.map(id => bookmarks[id]),
        bookmarkActions = (
          <BookmarkActions
            ascending={ascending}
            bookmarks={Object.values(bookmarks)}
            filteredBookmarks={filteredBookmarks}
            onSort={(sort) => this.handleSort(sort)}
            selectBookmark={(id) => selectBookmark(id)}
            sortBy={sortBy}
            />
        );

    if (filtered.length) {
      let sortedBookmarks = filteredBookmarks.sort(this.sort()),
          isActive = sortedBookmarks.length === 1;

      return (
        <div className='bookmark-list__container'>
          {bookmarkActions}
          <ul className='tagmarker-list bookmark-list'>
            {sortedBookmarks.map(bookmark => (
              <BookmarkListItem bookmark={bookmark} isActive={isActive} key={bookmark.id} />
            ))}
          </ul>
        </div>
      )
    }
    return (
      <div className='bookmark-list__container'>
        {bookmarkActions}
        <p className='empty-list__message'>no bookmarks to display</p>
      </div>
      )
  }
}
