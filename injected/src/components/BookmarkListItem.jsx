import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Alert from './Alert';
import Bookmark from './Bookmark';
import EditBookmark from './EditBookmark';

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

  handleClickDelete () {
    Alert('are you sure you want to delete this bookmark?', 'confirm delete', 'yes, delete').then(isConfirmed => {
      if (isConfirmed) {
        Alert('delete bookmark from chrome as well?', 'delete bookmark', 'delete from chrome', 'keep bookmark').then(isConfirmed => {
          // if so, delete the bookmark from chrome
          if (isConfirmed) chrome.bookmarks.remove(this.props.bookmark.id);
          this.props.removeBookmark(this.props.bookmark.id);
        })
      }
    });
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

  renderBookmark () {
    let { bookmark, tags } = this.props,
        { active, isEditing, selected } = this.state;

    if (active) {
      if (isEditing) {
        return (
          <div className='bookmark__item'>
            <EditBookmark
              onChange={(field, event) => this.handleChange(field, event)}
              selected={selected}
              setSelectedTags={(tags) => this.setSelectedTags(tags)}
              tags={tags}
              title={bookmark.title}
              url={bookmark.url}
              />
            <span className='bookmark__actions'>
              <button className='button bookmark-action__button action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
              <button className='button bookmark-action__button action-button' onClick={() => this.handleExitEdit()}>Cancel <i className='fa fa-ban'/></button>
              <button className='button bookmark-action__button action-button' onClick={() => this.handleClickDelete()}>Delete <i className='fa fa-trash-o'/></button>
            </span>
          </div>
        );
      }
      return (
        <div className='bookmark__item'>
          <Bookmark
            dateAdded={bookmark.dateAdded}
            selected={selected}
            tags={tags}
            title={bookmark.title}
            url={bookmark.url}
            />
          <button className='button bookmark-action__button action-button bookmark-edit__button' onClick={() => this.handleClickEdit()}>Edit <i className='fa fa-pencil'/></button>
        </div>
      );
    }
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
        {this.renderBookmark()}
      </li>
    );
  }
}
