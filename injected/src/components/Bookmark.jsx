import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';

export default class Bookmark extends Component {
  constructor (props) {
    super(props);
  }

  renderTags () {
    let { isEditing, selected, tags } = this.props,
        // get tag object for each id
        selectTags = selected.map(id => {
          // if a tag object exists for the id, return that
          if (tags[id]) return tags[id];
          // otherwise, create an object for the tag to be created
          return { title: id, id: id }
        });

    if (isEditing) {
      // render each tag associated with the bookmark, plus
      // the ones staged to be added to the bookmark
      return (
        <EditableTags
          selectTags={(tags) => this.props.setSelectedTags(tags)}
          selected={selected}
          tags={tags}
          />
      );
    }
    return (
      <MarqueeWrapper>
        {selectTags.map(tag => (
          <span className='bookmark__tag' key={tag.id}>{tag.title}</span>
        ))}
      </MarqueeWrapper>
    );
  }

  render () {
    let { bookmark } = this.props;
    
    return (
      <div className='bookmark__details'>
        <div className='bookmark-detail bookmark-detail__link'>
          <a className='bookmark-detail__link' href={bookmark.url} target='_parent'><img className='bookmark-favicon' src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}/>{bookmark.title || bookmark.url}</a>
        </div>
        <div className='bookmark-detail bookmark-detail__date'>
          <span className='detail-title'>Created:</span> { new Date(bookmark.dateAdded).toLocaleString() }
        </div>
        <div className='bookmark-detail bookmark-detail__tags'>
          {this.renderTags()}
        </div>
      </div>
    );
  }
}
