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

  render () {
    let { ascending, sortBy } = this.state;
    
    return (
      <div className='tag-list__container'>
        <TagActions ascending={ascending} sortBy={sortBy} onSort={(sort) => this.handleSort(sort)} />
        <ul className='tagmarker-list tag-list'>
          <SelectedTags />
          <FilteredTags ascending={ascending} sortBy={sortBy} />
        </ul>
      </div>
    );
  }
}
