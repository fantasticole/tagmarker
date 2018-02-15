import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BookmarkList from './BookmarkList';
import TagList from './TagList';

/**
 * ListView
 *
 * @param {array} bookmarks - all bookmark objects
 * @param {array} tags - all tag objects
 */
export default class ListView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      filteredBookmarks: [],
      filteredTags: Object.values(this.props.tags),
      selectedTags: [],
    };
  }

  componentDidUpdate (prevProps) {
    let { bookmarks, tags } = this.props,
        oldBookmarks = prevProps.bookmarks,
        oldTags = prevProps.tags,
        // see if the amount of bookmarks changed
        bookmarksLengthChanged = Object.keys(bookmarks).length !== Object.keys(oldBookmarks).length,
        // see if the amount of tags changed
        tagsLengthChanged = Object.keys(tags).length !== Object.keys(oldTags).length,
        // see if the filtered bookmarks' data changed
        bookmarksChanged = this.state.filteredBookmarks.some(bookmark => {
          return JSON.stringify(bookmark) !== JSON.stringify(bookmarks[bookmark.id]);
        });

    // if we have any pertinent changes, filter the bookmarks
    if (bookmarksLengthChanged || tagsLengthChanged || bookmarksChanged) {
      this.filter(this.state.selectedTags);
    }
  }

  handleDeselect (id) {
    let selectedTags = this.state.selectedTags.filter(tag => tag.id !== id);

    if (selectedTags.length) {
      this.setState({ selectedTags });
      this.filter(selectedTags);
    }
    else this.setState({
      filteredBookmarks: [],
      filteredTags: Object.values(this.props.tags),
      selectedTags,
    });
  }

  handleSelect (id) {
    let { selectedTags } = this.state,
        { tags } = this.props;

    selectedTags.push(tags[id]);
    this.setState({ selectedTags });
    this.filter(selectedTags);
  }

  handleSelectBookmark (id) {
    let { bookmarks, tags } = this.props,
        { selectedTags } = this.state,
        selectedIds = selectedTags.map(tag => tag.id),
        // set the filtered tags as those related to the selected
        // bookmark but not in the selectedTags array
        filteredTags = bookmarks[id].tags.filter(id => !selectedIds.includes(id)).map(id => tags[id]);

    this.setState({ filteredBookmarks: [ bookmarks[id] ], filteredTags });
  }

  filter (selectedTags) {
    let { bookmarks, tags } = this.props,
        selectedIds = selectedTags.map(tag => tag.id),
        // set default values in case we have no selected ids
        filteredBookmarks = [],
        filteredTags = Object.values(tags),
        allTags;

    if (selectedIds.length) {
      filteredBookmarks = Object.values(bookmarks).filter(b => {
        // include it if every selected tag is in its tags array
        return selectedIds.every((id) => b.tags.includes(id));
      });

      // get a list of all of the filtered bookmarks' tags
      allTags = filteredBookmarks.reduce((tags, bookmark) => {
        return tags.concat(bookmark.tags);
      }, []);

      // get a unique list of those tag ids
      filteredTags = Array.from(new Set(allTags)).filter(id => {
        // excluding those already selected
        return !selectedIds.includes(id);
      // and then grab the tag objects
      }).map(id => tags[id]);
    }

    this.setState({ filteredBookmarks, filteredTags });
  }

  render () {
    let { filteredBookmarks, filteredTags, selectedTags } = this.state,
        { bookmarks, tags } = this.props;

    return (
      <div className='drawer__content lists'>
        <TagList
          allTags={Object.values(tags)}
          filteredTags={filteredTags}
          selectedTags={selectedTags}
          onDeselect={(id) => this.handleDeselect(id)}
          onSelect={(id) => this.handleSelect(id)}
          />
        <BookmarkList
          bookmarks={bookmarks}
          filteredBookmarks={filteredBookmarks}
          selectBookmark={(id) => this.handleSelectBookmark(id)}
          />
      </div>
    );
  }
}
