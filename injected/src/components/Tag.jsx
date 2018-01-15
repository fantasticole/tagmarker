import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';

export default class Tag extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { isSelected, tag } = this.props,
        tagClasses = classNames('tag', { 'selected': isSelected });

    return (
      <li className='tag-item' onClick={() => this.props.onClick(tag.id)} >
        <MarqueeWrapper>
          <p className={tagClasses}>
            {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
          </p>
        </MarqueeWrapper>
      </li>
    );
  }
}
