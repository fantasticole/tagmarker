import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';

import ifTrue from '../utils/ifTrue';

class BookmarkList extends Component {
  constructor(props) {
    super(props);

    this.state = { active: [] };
  }

  handleClickMore (id) {
    let { active } = this.state,
        bookmarkIndex = active.indexOf(id);

    bookmarkIndex < 0 ? active.push(id) : active.splice(bookmarkIndex, 1);
    console.log('active:', active);
    this.setState({ active });
  }

  renderTags (tags) {
    return (
      <MarqueeWrapper>
        {tags.map(tagId => (
          <span className='bookmark-tag' key={tagId}>{this.props.tags[tagId].title}</span>
        ))}
      </MarqueeWrapper>
    );
  }

  render () {
    return (
      <ul className='tagmarker-list bookmark-list'>
        {this.props.selectedBookmarks.map(bookmark => {
          let isActive = this.state.active.indexOf(bookmark.id) > -1,
              bookmarkClasses = ['bookmark'];

          if (isActive) bookmarkClasses.push('active');

          return (
            <li className={bookmarkClasses.join(' ')} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
              <p
                className='bookmark-title'
                onClick={() => this.handleClickMore(bookmark.id)}
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
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(BookmarkList);
