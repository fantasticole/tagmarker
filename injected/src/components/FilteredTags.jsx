import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';
import OpenSelect from './OpenSelect';
import Tag from './Tag';

/**
 * FilteredTags
 *
 * @param {bool} ascending - direction of sort
 * @param {function} selectTag - function to select a tag
 * @param {string} sortBy - key to sort by
 * @param {array} tags - tags to render
 */
export default class FilteredTags extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.refs.filtered.focus();
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

  renderOption (option) {
    let tag = this.props.tags.find(t => t.id === option.value);

    return (
      <MarqueeWrapper>
        <Tag tag={tag} />
      </MarqueeWrapper>
    );
  }

  render () {
    let sortedTags = this.props.tags.sort(this.sort());
    let options = sortedTags.map(tag => ({ label: tag.title, value: tag.id }));

    return (
      <div className='filtered-tags__list'>
        {
          sortedTags.length ?
          <OpenSelect
            className='filtered-selector'
            name='filtered-select'
            onChange={(selected) => this.props.selectTag(selected.value)}
            options={options}
            optionRenderer={(option) => this.renderOption(option)}
            placeholder='search tags'
            ref='filtered'
            value=''
            /> :
          <p className='empty-list__message'>no related tags to display</p>
        }
      </div>
    );
  }
}
