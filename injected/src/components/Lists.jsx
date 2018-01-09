import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Select from 'react-select';
import BookmarkList from './BookmarkList';
import TagList from './TagList';

class Lists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredBookmarks: [],
      filteredTags: Object.values(this.props.tags),
      selectedTags: [],
      options: [],
    };
  }

  componentDidMount () {
    this.loadBookmarks();
    this.setOptions(this.state.filteredTags);
  }

  handleClickTag (id) {
    let { selectedBookmarks, selectedTags } = this.state,
        { tags } = this.props,
        tagIndex = selectedTags.indexOf(id),
        filteredTags = Object.values(tags),
        relatedTags,
        filteredTagIds;

    // if the id is already in selectedTags, splice it out
    // otherwise, add it
    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);

    if (selectedTags.length) {
      // get list of unique related tag ids
      relatedTags = Array.from(new Set(
        // get related tag ids for each selected tag
        selectedTags.reduce((arr, tagId) => {
          return arr.concat(tags[tagId].related);
        }, [])
      ));
      // only keep the ones that appear in all related arrays
      filteredTags = relatedTags
        .filter(tagId => {
          return selectedTags.every(id => tags[id].related.includes(tagId));
        })
        // get the actual tag objects
        .map(id => (tags[id]));
    }
    // update the state
    this.setState({ filteredTags, selectedTags });

    // update bookmarks and select options
    this.loadBookmarks();
    this.setOptions(filteredTags);
  }

  loadBookmarks () {
    let { bookmarks, tags } = this.props,
        { selectedTags } = this.state,
        // get all bookmarks associated with current tags
        selectedBookmarks = selectedTags.reduce((arr, id) => {
          // filter tag's bookmarks array for duplicates
          let additions = tags[id].bookmarks.filter(bookmark => (
            // return item if not already in arr
            !arr.includes(bookmark)
          ));
          // add unique ids to arr
          return arr.concat(additions)
        // }, []);
        }, []),
        filteredBookmarks = selectedBookmarks.filter(b => {
          let current = bookmarks.find(bookmark => bookmark.id === b);

          return selectedTags.every((id) => current.tags.includes(id))
        });

    this.setState({ filteredBookmarks });
  }

  setOptions (filteredTags) {
    let options = filteredTags.map(t => ({ label: t.title, value: t.id })),
        // sort the options to appear alphabetically
        sortedOptions = this.sortOptions(options);

    this.setState({ options: sortedOptions });
  }

  sortOptions(options) {
    return options.sort((a, b) => {
      let aLabel = a.label.toLowerCase(),
          bLabel = b.label.toLowerCase();

      if (aLabel < bLabel) return -1;
      if (aLabel > bLabel) return 1;
      return 0;
    });
  }

  render () {
    let { selectedTags } = this.state,
        selected = selectedTags.map(id => (this.props.tags[id]));

    return (
      <div className='drawer__content lists'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <Select.Creatable
          className='taglist-selector'
          multi={false}
          name='taglist-select'
          onChange={(selected) => this.handleClickTag(selected.value)}
          options={this.state.options}
          value=''
          />
        <TagList
          handleClickTag={(id) => this.handleClickTag(id)}
          selectedTags={selected}
          tags={this.state.filteredTags}
          />
        <h1 className='drawer__header bookmarks__header'>Bookmarks</h1>
        <BookmarkList
          selectedBookmarks={this.state.filteredBookmarks}
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    tags: state.tags,
  };
}
export default connect(mapStateToProps)(Lists);
