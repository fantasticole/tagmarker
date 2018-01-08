import React, { Component } from 'react';
import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';

class TagList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tagNames = this.props.tags ? Object.values(this.props.tags) : [],
        sortedTagNames = tagNames.sort((a, b) => {
          let aTitle = a.title.toLowerCase(),
              bTitle = b.title.toLowerCase();

          if (aTitle < bTitle) return -1;
          if (aTitle > bTitle) return 1;
          return 0;
        });

    return (
      <ul className='tagmarker-list tag-list'>
        {sortedTagNames.map(tag => {
          let tagClasses = ['tag'];

          // add class if tag is selected
          if (this.props.selectedTags.includes(tag.id)) {
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

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(TagList);
