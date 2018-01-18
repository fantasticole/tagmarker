import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';

/**
 * Bookmark
 *
 * @param {number} [dateAdded] - optional date bookmark was created
 * @param {bool} isEditing - whether the bookmark is being edited or not
 * @param {function} onChange - function to run when input changes
 * @param {array} selected - list of selected tag ids
 * @param {function} setSelectedTags - function to run when tag is selected
 * @param {array} [suggested] - optional list of suggested tag ids
 * @param {object} tags - all tags from store
 * @param {string} title - bookmark title
 * @param {string} url - bookmark url
 */
export default class Bookmark extends Component {
  constructor (props) {
    super(props);

    this.state = {
      suggested: this.props.suggested ? this.props.suggested : [],
    }
  }

  componentDidUpdate (prevProps) {
    let { suggested } = this.props,
        lengthChanged = suggested ? suggested.length !== prevProps.suggested.length : false,
        propsChanged;

    // if the length didn't change and we get ids, see if they changed
    if (!lengthChanged && suggested && suggested.length > 0) {
      propsChanged = suggested.some((id, i) => (id !== prevProps.suggested[i]));
    }

    // if the suggested ids have changed
    if (lengthChanged || propsChanged) {
      // update the options
      this.setState({ suggested });
    }
  }

  render () {
    let { suggested } = this.state,
        { dateAdded, isEditing, selected, tags, title, url } = this.props,
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
            className='bookmark__input modal__input'
            defaultValue={title}
            name='title'
            onChange={(e) => this.props.onChange('title', e)}
            placeholder='bookmark name'
            type='text'
            />
          <input
            className='bookmark__input modal__input'
            defaultValue={url}
            name='url'
            onChange={(e) => this.props.onChange('url', e)}
            placeholder='url'
            type='text'
            />
          <EditableTags
            selectTags={(tags) => this.props.setSelectedTags(tags)}
            selected={selected}
            suggested={suggested}
            tags={tags}
            />
        </div>
      );
    }
    return (
      <div className='bookmark__details bookmark__details--is_static'>
        <div className='bookmark-detail bookmark-detail__link'>
          <a className='bookmark-detail__link' href={url} target='_parent'><img className='bookmark-favicon' src={`http://www.google.com/s2/favicons?domain=${url}`}/>{title || url}</a>
        </div>
        <div className='bookmark-detail bookmark-detail__date'>
          <span className='detail-title'>Created:</span> { new Date(dateAdded).toLocaleString() }
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
