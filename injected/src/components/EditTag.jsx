import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MarqueeWrapper from './MarqueeWrapper';

/**
 * EditTag
 *
 * @param {function} removeTag - function to remove the tag
 * @param {object} tag - tag to be rendered
 * @param {function} updateTag - function to update the tag
 */
export default class EditTag extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      title: this.props.tag.title,
    }
  }

  handleDeleteTag () {
    console.log('delete!')
    // this.props.removeTag(this.props.tag.id)
  }

  handleUpdateTag () {
    console.log('update!')
    // this.props.updateTag(this.props.tag)
  }

  render () {
    let { tag } = this.props;

    return (
      <li className='tag-item tag-item--is_editable'>
        <button className='button edit-tag__button' onClick={() => this.handleDeleteTag()}>
          <i className='clear-tag fa fa-times-circle'/>
        </button>
        <button className='button edit-tag__button' onClick={() => this.handleUpdateTag()}>
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
