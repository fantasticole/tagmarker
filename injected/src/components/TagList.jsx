import React, { Component } from 'react';

import TagActions from './TagActions';
import FilteredTags from './FilteredTags';
import SelectedTags from './SelectedTags';

import ifTrue from '../utils/ifTrue';

/**
 * TagList
 * 
 * @param {array} allTags - all tag objects
 * @param {array} filteredTags - filtered tag objects
 * @param {function} onDeselect - function to remove selected tag
 * @param {function} onSelect - function to run when tag is selected
 * @param {array} selectedTags - selected tag objects
 */
export default class TagList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ascending: true,
      editing: false,
      sortBy: 'alpha',
    };
  }

  handleToggleEdit () {
    this.setState({ editing: !this.state.editing });
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
    let { ascending, editing, sortBy } = this.state,
        { allTags, filteredTags, onDeselect, selectedTags, onSelect } = this.props;

    return (
      <div className='tag-list__container'>
        <TagActions
          ascending={ascending}
          editing={editing}
          onEdit={() => this.handleToggleEdit()}
          onSort={(sort) => this.handleSort(sort)}
          sortBy={sortBy}
          tagCount={filteredTags.length}
          />
        <ul className='tagmarker-list tag-list'>
          {ifTrue(!editing).render(() => (
            <SelectedTags removeTag={(id) => onDeselect(id)} tags={selectedTags} />
          ))}
          <FilteredTags ascending={ascending} editing={editing} selectTag={(id) => onSelect(id)} sortBy={sortBy} tags={editing ? allTags : filteredTags} />
        </ul>
      </div>
    );
  }
}
