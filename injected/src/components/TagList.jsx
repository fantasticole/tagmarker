import React, { Component } from 'react';

import TagActions from './TagActions';
import FilteredTags from './FilteredTags';
import SelectedTags from '../containers/SelectedTags';

export default class TagList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ascending: true,
      sortBy: 'alpha',
    };
  }

  handleSetSort (sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ ascending: !this.state.ascending });
    }
    else {
      this.setState({ sortBy, ascending: true });
    }
  }

  sort () {
    let { sortBy, ascending } = this.state;

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
        // if numerically
        case 'num':
          // the amount of bookmarks
          aProp = a.bookmarks.length;
          bProp = b.bookmarks.length;
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
        { filteredTags } = this.props,
        sortedTags = filteredTags.sort(this.sort());

    return (
      <div className='tag-list__container'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <TagActions ascending={ascending} filteredTags={filteredTags} onSort={(sort) => this.handleSetSort(sort)} selectTag={this.props.selectTag} sortBy={sortBy}/>
        <ul className='tagmarker-list tag-list'>
          <SelectedTags />
          <FilteredTags selectTag={this.props.selectTag} tags={sortedTags} />
        </ul>
      </div>
    );
  }
}
