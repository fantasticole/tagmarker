import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';

export default class SelectedTags extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='selected-tags__list'>
        {
          this.props.tags.map(tag => {
            return (
              <li
                className='tag-item'
                key={tag.id}
                onClick={() => this.props.removeTag(tag.id)}
                >
                <MarqueeWrapper>
                  <p className='tag selected'>
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
