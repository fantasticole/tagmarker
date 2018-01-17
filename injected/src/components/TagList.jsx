import React, { Component } from 'react';

import TagActions from '../containers/TagActions';
import FilteredTags from '../containers/FilteredTags';
import SelectedTags from '../containers/SelectedTags';

/**
 * TagList
 */
export default class TagList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='tag-list__container'>
        <TagActions />
        <ul className='tagmarker-list tag-list'>
          <SelectedTags />
          <FilteredTags />
        </ul>
      </div>
    );
  }
}
