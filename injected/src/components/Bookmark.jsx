import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';

import ifTrue from '../utils/ifTrue';

class Bookmark extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  handleAddTag () {
    console.log('add!')
  }

  handleClickCancel () {
    console.log('Cancel!')
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    console.log('Save!')
  }

  handleDeleteTag (tagId) {
    let tag = this.props.tags[tagId];

    // console.log('bookmark:', bookmark)
    console.log('this:', this)
    console.log('tag:', tag)
  }

  renderBookmarkActions () {
    if (this.state.isEditing) {
      return (
        <span>
          <button onClick={() => this.handleClickSave()}>Save &#9881;</button>
          <button onClick={() => this.handleClickCancel()}>Cancel &times;</button>
        </span>
      );
    }
    return (
      <button onClick={() => this.handleClickEdit()}>Edit &#9881;</button>
    );
  }

  renderTags (tags) {
    if (this.state.isEditing) {
      return (
        <span className='bookmark-tags__editing'>
          {tags.map(tagId => (
            <span className='bookmark-tag' key={tagId}>
              {this.props.tags[tagId].title}
              <button className='button bookmark-button' onClick={() => this.handleDeleteTag(tagId)}>&times;</button>
            </span>
          ))}
          <button className='button add-tag' onClick={() => this.handleAddTag()}>+</button>
        </span>
      );
    }
    return (
      <MarqueeWrapper>
        {tags.map(tagId => (
          <span className='bookmark-tag' key={tagId}>{this.props.tags[tagId].title}</span>
        ))}
      </MarqueeWrapper>
    );
  }

  render () {
    let { bookmark, isActive } = this.props,
        bookmarkClasses = ['bookmark'];

    if (isActive) bookmarkClasses.push('active');
    
    return (
      <li className={bookmarkClasses.join(' ')} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
        <p
          className='bookmark-title'
          onClick={() => this.props.handleClickMore(bookmark.id)}
          >
          <button className='show-more'>&#10095;</button>
          {bookmark.title}
        </p>
        {ifTrue(isActive).render(() => (
          <div className='bookmark-info'>
            <div className='bookmark-info__detail'>
              <a className='bookmark-info__link' href={bookmark.url} target='_parent'>{bookmark.title || bookmark.url}</a>
            </div>
            <div className='bookmark-info__detail'>
              <span className='detail-title'>Date Added:</span> { new Date(bookmark.dateAdded).toLocaleString() }
            </div>
            <div className='bookmark-info__detail'>
              { this.renderTags(bookmark.tags) }
            </div>
            <div className='bookmark-info__detail'>
              {this.renderBookmarkActions()}
            </div>
          </div>
        ))}
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(Bookmark);
