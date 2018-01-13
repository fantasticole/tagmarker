import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import BookmarkList from '../containers/BookmarkList';
import TagList from '../containers/TagList';

export default class ListView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      filteredBookmarks: [],
      filteredTags: Object.keys(this.props.tags),
    };
  }

  componentDidMount () {
    this.filterBookmarks();
  }

  componentDidUpdate (prevProps) {
    let { selectedTags } = this.props,
        { filteredBookmarks } = this.state,
        // if any of the selected tags' bookmark count changes
        updateTags = selectedTags.some(tagId => {
          return prevProps.tags[tagId].bookmarks.length !== this.props.tags[tagId].bookmarks.length;
        }),
        updateBookmarks = filteredBookmarks.some(bId => {
          return prevProps.bookmarks[bId].tags.length !== this.props.bookmarks[bId].tags.length;
        }),
        selectedChanged = prevProps.selectedTags.length !== this.props.selectedTags.length;

    // update the bookmarks
    if (updateTags) this.filterTags();
    if (selectedChanged || updateBookmarks) {
      this.filterBookmarks();
      this.filterTags();
    }
  }

  filterBookmarks () {
    let { bookmarks, selectedTags, tags } = this.props,
        filteredBookmarks = Object.values(bookmarks).filter(b => {
          return selectedTags.every((id) => b.tags.includes(id));
        }).map(bookmark => bookmark.id);

    this.setState({ filteredBookmarks });
  }

  filterTags () {
    let { selectedTags, tags } = this.props,
        filteredTags = Object.keys(tags);

    if (selectedTags.length) filteredTags = this.getRelatedTags();
    // update the state
    this.setState({ filteredTags });
  }

  getRelatedTags () {
    let { selectedTags } = this.props,
        bookmarks = Object.values(this.props.bookmarks),
        filteredBookmarks = bookmarks.filter(b => {
          return selectedTags.every((id) => b.tags.includes(id));
        }),
        allTags = filteredBookmarks.reduce((tags, bookmark) => {
          return tags.concat(bookmark.tags);
        }, []),
        relatedTags = Array.from(new Set(allTags)).filter(id => {
          return !selectedTags.includes(id);
        });

    return relatedTags;
  }

  render () {
    let { filteredTags, filteredBookmarks } = this.state,
        filtered = filteredTags.map(id => (this.props.tags[id]));

    return (
      <div className='drawer__content lists'>
        <TagList filteredTags={filtered} />
        <BookmarkList selectedBookmarks={filteredBookmarks} />
      </div>
    );
  }
}
