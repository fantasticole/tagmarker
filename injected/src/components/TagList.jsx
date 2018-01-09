import React, { Component } from 'react';

import MarqueeWrapper from './MarqueeWrapper';

class TagList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { selectedTags, tags } = this.props,
        sortedTags = tags.sort((a, b) => {
          let aTitle = a.title.toLowerCase(),
              bTitle = b.title.toLowerCase();

          if (aTitle < bTitle) return -1;
          if (aTitle > bTitle) return 1;
          return 0;
        }),
        allTags = selectedTags.concat(sortedTags),
        selectedIds = selectedTags.map(t => (t.id));

    return (
      <ul className='tagmarker-list tag-list'>
        {allTags.map(tag => {
          let tagClasses = ['tag'];

          // add class if tag is selected
          if (selectedIds.includes(tag.id)) {
            tagClasses.push('selected');
          }

          return (
            <li
              className='tag-item'
              key={tag.id}
              onClick={() => this.props.handleClickTag(tag.id)}
              >
              <MarqueeWrapper>
                <p className={tagClasses.join(' ')}>
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
