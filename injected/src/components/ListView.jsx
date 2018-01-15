import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import BookmarkList from '../containers/BookmarkList';
import TagList from './TagList';

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
