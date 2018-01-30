import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkList from '../containers/BookmarkList';
import TagList from '../containers/TagList';

/**
 * ListView
 */
export default class ListView extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='drawer__content lists'>
        <TagList />
        <BookmarkList />
      </div>
    );
  }
}
