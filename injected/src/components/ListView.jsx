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
      selectedTags: [],
    };
  }

  componentDidMount () {
    this.filterBookmarks();
  }

  componentDidUpdate (prevProps) {
    let { selectedTags, filteredBookmarks } = this.state,
        // if any of the selected tags' bookmark count changes
        updateTags = selectedTags.some(tagId => {
          return prevProps.tags[tagId].bookmarks.length !== this.props.tags[tagId].bookmarks.length;
        }),
        updateBookmarks = filteredBookmarks.some(bId => {
          return prevProps.bookmarks[bId].tags.length !== this.props.bookmarks[bId].tags.length;
        });

    // update the bookmarks
    if (updateTags) this.filterTags();
    if (updateBookmarks) {
      this.filterBookmarks();
      this.filterTags();
    }
  }

  handleClickTag (id) {
    let { selectedTags } = this.state,
        tagIndex = selectedTags.indexOf(id);

    // if the id is already in selectedTags, splice it out
    // otherwise, add it
    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);
    // update the state
    this.setState({ selectedTags });

    // update bookmarks
    this.filterBookmarks();
    this.filterTags();
  }

  filterBookmarks () {
    let { bookmarks, tags } = this.props,
        { selectedTags } = this.state,
        filteredBookmarks = Object.values(bookmarks).filter(b => {
          return selectedTags.every((id) => b.tags.includes(id));
        }).map(bookmark => bookmark.id);

    this.setState({ filteredBookmarks });
  }

  filterTags () {
    let { selectedTags } = this.state,
        { tags } = this.props,
        filteredTags = Object.keys(tags);

    if (selectedTags.length) filteredTags = this.getRelatedTags();
    // update the state
    this.setState({ filteredTags });
  }

  getRelatedTags () {
    let { selectedTags } = this.state,
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
    let { filteredTags, filteredBookmarks, selectedTags } = this.state,
        selected = selectedTags.map(id => (this.props.tags[id])),
        filtered = filteredTags.map(id => (this.props.tags[id]));

    return (
      <div className='drawer__content lists'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <TagList
          onClickTag={(id) => this.handleClickTag(id)}
          selectedTags={selected}
          filteredTags={filtered}
          />
        <h1 className='drawer__header bookmarks__header'>Bookmarks</h1>
        <BookmarkList
          selectedBookmarks={filteredBookmarks}
          />
      </div>
    );
  }
}
