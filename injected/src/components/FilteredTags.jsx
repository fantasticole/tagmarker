import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';

export default class FilteredTags extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='filtered-tags__list'>
        {
          this.props.tags.map(tag => {
            return (
              <li
                className='tag-item'
                key={tag.id}
                onClick={() => this.props.selectTag(tag.id)}
                >
                <MarqueeWrapper>
                  <p className='tag'>
                    {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
                  </p>
                </MarqueeWrapper>
              </li>
            );
          })
        }
      </div>
    );
  }
}
