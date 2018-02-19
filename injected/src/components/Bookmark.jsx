import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';

/**
 * Bookmark
 *
 * @param {number} [dateAdded] - optional date bookmark was created
 * @param {array} selected - list of selected tag ids
 * @param {object} tags - all tags from store
 * @param {string} title - bookmark title
 * @param {string} url - bookmark url
 */
export default class Bookmark extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { dateAdded, selected, tags, title, url } = this.props,
        // get tag object for each id
        selectTags = selected.map(id => {
          // if a tag object exists for the id, return that
          if (tags[id]) return tags[id];
          // otherwise, create an object for the tag to be created
          return { title: id, id: id }
        });

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
