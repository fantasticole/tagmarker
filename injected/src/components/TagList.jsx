import React, { Component } from 'react';

import TagActions from '../containers/TagActions';
import FilteredTags from '../containers/FilteredTags';
import SelectedTags from '../containers/SelectedTags';

export default class TagList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='tag-list__container'>
        <div className='drawer__header tags__header'>
          <h1 className='drawer__header-text'>Tags</h1>
        </div>
        <TagActions />
        <ul className='tagmarker-list tag-list'>
          <SelectedTags />
          <FilteredTags />
        </ul>
      </div>
    );
  }
}
