import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';

/**
 * EditTag
 *
 * @param {object} tag - tag to be rendered
 */
export default class EditTag extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { tag } = this.props;

    return (
      <li className='tag-item' >
        <button>
          <i className='clear-tag fa fa-times-circle'/>
        </button>
        <button>
          <i className='clear-tag fa fa-pencil'/>
        </button>
        <MarqueeWrapper>
          <p className='tag'>
            {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
          </p>
        </MarqueeWrapper>
      </li>
    );
  }
}
