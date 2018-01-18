import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Bookmark from './Bookmark';

import ifTrue from '../utils/ifTrue';

/**
 * BookmarkListItem
 *
 * @param {object} bookmark - bookmark to be rendered
 * @param {bool} isActive - tells bookmark to be open by default or not
 * @param {object} tags - all tags from store
 * @param {function} updateBookmark - function save bookmark updates
 */
export default class BookmarkListItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      active: this.props.isActive,
      isEditing: false,
      selected: [...this.props.bookmark.tags],
      title: this.props.bookmark.title,
      url: this.props.bookmark.url,
    };
  }

  componentDidUpdate (prevProps) {
    // if the active status prop changes
    if (this.props.isActive !== prevProps.isActive) {
      // update the state
      this.setState({ active: this.props.isActive });
    }
  }

  handleChange (field, event) {
    this.setState({ [field]: event.target.value });
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    let { bookmark } = this.props,
        { selected, title, url } = this.state,
        updatedBookmark = Object.assign({}, bookmark, {
          tags: selected,
          title,
          url,
        });

    this.props.updateBookmark(updatedBookmark);
    // exit editing state
    this.setState({ isEditing: false });
  }

  handleExitEdit (reset) {
    // reset tags and exit editing state
    this.setState({
      isEditing: false,
      selected: [...this.props.bookmark.tags],
    });
  }

  handleToggleDetails () {
    this.setState({ active: !this.state.active });
  }

  setSelectedTags (selected) {
    this.setState({ selected });
  }

  renderBookmarkActions () {
    if (this.state.isEditing) {
      return (
        <span className='bookmark__actions'>
          <button className='button bookmark-action__button action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button bookmark-action__button action-button' onClick={() => this.handleExitEdit()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      );
    }
    return (
      <button className='button bookmark-action__button action-button' onClick={() => this.handleClickEdit()}>Edit <i className='fa fa-pencil'/></button>
    );
  }

  render () {
    let { bookmark, tags } = this.props,
        { active, isEditing, selected } = this.state,
        bookmarkClasses = classNames('bookmark', {
          'active': active,
        });
    
    return (
      <li className={bookmarkClasses} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
        <p
          className='bookmark__title'
          onClick={() => this.handleToggleDetails()}
          >
          <button className='show-more'><i className='fa fa-caret-right'/></button>
          {bookmark.title || bookmark.url}
        </p>
        {ifTrue(active).render(() => (
          <div className='bookmark__item'>
            <Bookmark
              bookmark={bookmark}
              isEditing={isEditing}
              onChange={(field, event) => this.handleChange(field, event)}
              selected={selected}
              setSelectedTags={(tags) => this.setSelectedTags(tags)}
              tags={tags}
              />
            {this.renderBookmarkActions()}
          </div>
        ))}
      </li>
    );
  }
}
