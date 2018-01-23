import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';

/**
 * Tag
 *
 * @param {bool} isSelected - whether the tag is selected or not
 * @param {function} onClick - function to run when tag is clicked
 * @param {object} tag - tag to be rendered
 */
export default class Tag extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { isSelected, tag } = this.props;

    if (isSelected) {
      return (
        <li className='tag-item' onClick={() => this.props.onClick(tag.id)} >
          <MarqueeWrapper>
            <p className='tag selected'>
              {tag.title} <i className='clear-tag fa fa-times-circle'/>
            </p>
          </MarqueeWrapper>
        </li>
      );
    }
    return (
      <li className='tag-item' onClick={() => this.props.onClick(tag.id)} >
        <MarqueeWrapper>
          <p className='tag'>
            {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
          </p>
        </MarqueeWrapper>
      </li>
    );
  }
}
