import React, { Component } from 'react';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';

class TagList extends Component {
  constructor (props) {
    super(props);
  }

  handleSort (sortBy, ascending) {
    return (a, b) => {
      // if we're sorting alphabetically, let the prop be the title
      // otherwise, the amount of bookmarks
      let aProp = sortBy === 'alpha' ? a.title.toLowerCase() : a.bookmarks.length,
          bProp = sortBy === 'alpha' ? b.title.toLowerCase() : b.bookmarks.length,
          // make the sort direction dynamic
          num = ascending ? -1 : 1;

      if (aProp < bProp) return num;
      if (aProp > bProp) return -num;
      return 0;
    }
  }

  render () {
    let { selectedTags, sort, tags } = this.props,
        sortedTags = tags.sort(this.handleSort(sort.sortBy, sort.ascending)),
        allTags = selectedTags.concat(sortedTags),
        selectedIds = selectedTags.map(t => (t.id));

    return (
      <ul className='tagmarker-list tag-list'>
        {allTags.map(tag => {
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
        })}
      </ul>
    );
  }
}

export default TagList;
