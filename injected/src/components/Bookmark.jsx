import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';

import ifTrue from '../utils/ifTrue';
import { deleteTags } from '../utils/actions';

class Bookmark extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      isEditing: false,
      tagsToAdd: [],
      tagsToDelete: [],
    };
  }

  handleAddTag (tagId) {
    let { tagsToAdd } = this.state;

    tagsToAdd.push(tagId);
    this.setState({ tagsToAdd });
  }

  handleClickAdd () {
    console.log('add!')
  }

  handleClickCancel () {
    this.setState({ isEditing: false });
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    let { bookmark } = this.props,
        { tagsToDelete } = this.state;

    this.props.dispatch(deleteTags(bookmark.id, tagsToDelete));
  }

  handleDeleteTag (tagId) {
    let { tagsToDelete } = this.state;

    tagsToDelete.push(tagId);
    this.setState({ tagsToDelete });
  }

  handleToggleDetails () {
    this.setState({ active: !this.state.active });
  }

  renderBookmarkActions () {
    if (this.state.isEditing) {
      return (
        <span>
          <button className='button bookmark__action-button add-tag' onClick={() => this.handleClickAdd()}>Add Tag <i className='fa fa-plus-circle'/></button>
          <button className='button bookmark__action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button bookmark__action-button' onClick={() => this.handleClickCancel()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      );
    }
    return (
      <button className='button' onClick={() => this.handleClickEdit()}>Edit <i className='fa fa-pencil'/></button>
    );
  }

  renderTags (tags) {
    if (this.state.isEditing) {
      return (
        <span className='bookmark-tags__editing'>
          {tags.map(tagId => {
            if (this.state.tagsToDelete.indexOf(tagId) < 0){
              return (
                <button className='button bookmark-button bookmark-tag' key={tagId} onClick={() => this.handleDeleteTag(tagId)}>{this.props.tags[tagId].title} <i className='fa fa-times-circle'/></button>
              );
            }
          })}
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
    let { bookmark } = this.props,
        { active } = this.state,
        bookmarkClasses = ['bookmark'];

    if (active) bookmarkClasses.push('active');
    
    return (
      <li className={bookmarkClasses.join(' ')} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
        <p
          className='bookmark-title'
          onClick={() => this.handleToggleDetails()}
          >
          <button className='show-more'><i className='fa fa-caret-right'/></button>
          {bookmark.title}
        </p>
        {ifTrue(active).render(() => (
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
