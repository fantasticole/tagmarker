import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Bookmark from './Bookmark';


class BookmarkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: [],
    };
  }

  handleClickMore (id) {
    let { active } = this.state,
        bookmarkIndex = active.indexOf(id);

    bookmarkIndex < 0 ? active.push(id) : active.splice(bookmarkIndex, 1);
    console.log('active:', active);
    this.setState({ active });
  }

  render () {
    return (
      <ul className='tagmarker-list bookmark-list'>
        {this.props.selectedBookmarks.map(bookmark => {
          let isActive = this.state.active.indexOf(bookmark.id) > -1;

          return (
            <Bookmark
              bookmark={bookmark}
              handleClickMore={(id) => this.handleClickMore(id)}
              isActive
              key={bookmark.id}
              />
            );
        })}
      </ul>
    );
  }
}

export default BookmarkList;
