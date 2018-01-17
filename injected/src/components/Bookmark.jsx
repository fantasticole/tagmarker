import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';

/**
 * Bookmark
 *
 * @param {object} bookmark - bookmark to be rendered
 * @param {bool} isEditing - whether the bookmark is being edited or not
 * @param {function} onChange - function to run when input changes
 * @param {array} selected - list of selected tag ids
 * @param {function} setSelectedTags - function to run when tag is selected
 * @param {array} [suggested] - optional list of suggested tag ids
 * @param {object} tags - all tags from store
 */
export default class Bookmark extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { bookmark, isEditing, selected, tags } = this.props,
        // get tag object for each id
        selectTags = selected.map(id => {
          // if a tag object exists for the id, return that
          if (tags[id]) return tags[id];
          // otherwise, create an object for the tag to be created
          return { title: id, id: id }
        });

    if (isEditing) {
      return (
        <div className='bookmark__details bookmark__details--is_editing'>
          <input
            className='create-bookmark__input modal__input'
            defaultValue={bookmark.title}
            name='title'
            onChange={(e) => this.props.onChange('title', e)}
            placeholder='bookmark name'
            type='text'
            />
          <input
            className='create-bookmark__input modal__input'
            defaultValue={bookmark.url}
            name='url'
            onChange={(e) => this.props.onChange('url', e)}
            placeholder='url'
            type='text'
            />
          <EditableTags
            selectTags={(tags) => this.props.setSelectedTags(tags)}
            selected={selected}
            tags={tags}
            />
        </div>
      );
    }
    return (
      <div className='bookmark__details bookmark__details--is_static'>
        <div className='bookmark-detail bookmark-detail__link'>
          <a className='bookmark-detail__link' href={bookmark.url} target='_parent'><img className='bookmark-favicon' src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}/>{bookmark.title || bookmark.url}</a>
        </div>
        <div className='bookmark-detail bookmark-detail__date'>
          <span className='detail-title'>Created:</span> { new Date(bookmark.dateAdded).toLocaleString() }
        </div>
        <div className='bookmark-detail bookmark-detail__tags'>
          <MarqueeWrapper>
            {selectTags.map(tag => (
              <span className='bookmark__tag' key={tag.id}>{tag.title}</span>
            ))}
          </MarqueeWrapper>
        </div>
      </div>
    );
  }
}
