import React, { Component } from 'react';

import TagActions from './TagActions';
import FilteredTags from './FilteredTags';
import SelectedTags from './SelectedTags';

/**
 * TagList
 * 
 * @param {array} filteredTags - filtered tag objects
 * @param {function} removeTag - function to remove selected tag
 * @param {array} selectedTags - selected tag objects
 * @param {function} selectTag - function to run when tag is selected
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
    let { ascending, sortBy } = this.state,
    { filteredTags, removeTag, selectedTags, selectTag } = this.props;

    return (
      <div className='tag-list__container'>
        <TagActions
          ascending={ascending}
          filteredTags={filteredTags}
          onSort={(sort) => this.handleSort(sort)}
          selectTag={(id) => selectTag(id)}
          sortBy={sortBy}
          />
        <ul className='tagmarker-list tag-list'>
          <SelectedTags removeTag={(id) => removeTag(id)} tags={selectedTags} />
          <FilteredTags ascending={ascending} selectTag={(id) => selectTag(id)} sortBy={sortBy} tags={filteredTags} />
        </ul>
      </div>
    );
  }
}
