import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkListItem from '../containers/BookmarkListItem';
import BookmarkActions from '../containers/BookmarkActions';

/**
 * BookmarkList
 *
 * @param {bool} ascending - direction of sort
 * @param {function} filteredBookmarks - list of bookmark ids
 * @param {string} sortBy - key to sort by
 */
export default class BookmarkList extends Component {
  constructor (props) {
    super(props);
  }

  sort () {
    let { ascending, sortBy } = this.props;

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
    if (this.props.filteredBookmarks.length) {
      let sortedBookmarks = this.props.filteredBookmarks.sort(this.sort()),
          isActive = sortedBookmarks.length === 1;

      return (
        <div className='bookmark-list__container'>
          <BookmarkActions />
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
        <BookmarkActions />
        <p className='bookmark__list-is_empty'>no bookmarks to display</p>
      </div>
      )
  }
}
