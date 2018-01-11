import React, { Component } from 'react';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';

import ifTrue from '../utils/ifTrue';

class TagList extends Component {
  constructor (props) {
    super(props);
  }

  handleSort (sortBy, ascending) {
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

  renderTags (allTags, selectedIds) {
    let tags = allTags.map(tag => {
      let tagClasses = classNames('tag', {
            'selected': selectedIds.includes(tag.id),
          });

      return (
        <li
          className='tag-item'
          key={tag.id}
          onClick={() => this.props.handleClickTag(tag.id)}
          >
          <MarqueeWrapper>
            <p className={tagClasses}>
              {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
            </p>
          </MarqueeWrapper>
        </li>
      );
    })

    // if we have both selected and unselected tags
    if (selectedIds.length && this.props.tags.length > 0) {
      // add divider between the two sets
      tags.splice(selectedIds.length, 0, <div key='divider' className='divider'/>);
    }
    return tags;
  }

  render () {
    let { selectedTags, sort, tags } = this.props,
        sortedTags = tags.sort(this.handleSort(sort.sortBy, sort.ascending)),
        allTags = selectedTags.concat(sortedTags),
        selectedIds = selectedTags.map(t => (t.id));

    return (
      <ul className='tagmarker-list tag-list'>
        {this.renderTags(allTags, selectedIds)}
      </ul>
    );
  }
}

export default TagList;
