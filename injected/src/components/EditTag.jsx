import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Alert from './Alert';
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

  handleClickDelete () {
    // make sure the user wants to delete
    Alert('are you sure you want to delete this tag?', 'confirm delete', 'yes, delete').then(isConfirmed => {
      if (isConfirmed) {
        // send their response to the store
        this.props.removeTag(this.props.tag.id)
        // see if the tag is also a folder
        if (!isNaN(this.props.tag.id)) {
          // if it is, ask if they want to delete the folder
          Alert('delete folder from chrome as well?', 'delete folder', 'delete from chrome', 'keep folder').then(isConfirmed => {
            // if they want to delete from chrome, let chrome know
            if (isConfirmed) chrome.bookmarks.remove(this.props.tag.id);
          })
        }
        // if not, delete the tag
        else this.props.removeTag(this.props.tag.id)
      }
    });
  }

  handleClickCancel () {
    this.setState({ isEditing: false, title: this.props.tag.title });
  }

  handleClickSave () {
    let { title } = this.state,
        updatedTag = Object.assign({}, this.props.tag, { title });

    this.props.updateTag(updatedTag);
    this.setState({ isEditing: false });
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  moveFocusToEnd (e) {
    let { value } = e.target;
    e.target.value = '';
    e.target.value = value;
  }

  render () {
    let { tag } = this.props,
        { isEditing, title } = this.state;

    if (isEditing) {
      return (
        <li className='tag-item tag-item--is_editing'>
          <span className='tag'>
            <input
              autoFocus
              className='tag-name__input'
              defaultValue={title}
              name='title'
              onChange={(e) => this.setState({ title: e.target.value })}
              onFocus={(e) => this.moveFocusToEnd(e)}
              placeholder='title'
              type='text'
              />
          </span>
          <span className='edit-tag__actions'>
            <button className='button edit-tag__button action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
            <button className='button edit-tag__button action-button' onClick={() => this.handleClickCancel()}>Cancel <i className='fa fa-ban'/></button>
            <button className='button edit-tag__button action-button' onClick={() => this.handleClickDelete()}>Delete <i className='fa fa-trash-o'/></button>
          </span>
        </li>
      );
    }
    return (
      <li className='tag-item tag-item--is_editable' onClick={() => this.handleClickEdit()}>
        <span className='tag-name__wrapper'>
          <MarqueeWrapper>
            <p className='tag'>
              {this.state.title} <span className='tagCount'>{tag.bookmarks.length}</span>
            </p>
          </MarqueeWrapper>
        </span>
      </li>
    );
  }
}
