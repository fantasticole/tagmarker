import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Select from 'react-select';
import BookmarkList from '../containers/BookmarkList';
import TagList from '../containers/TagList';

export default class ListView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ascending: true,
      filteredBookmarks: [],
      filteredTags: Object.keys(this.props.tags),
      isSearching: false,
      selectedTags: [],
      sortBy: 'alpha',
      options: [],
    };
  }

  componentDidMount () {
    this.filterBookmarks();
    this.setOptions(this.state.filteredTags);
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

    // update bookmarks and select options
    this.filterBookmarks();
    this.filterTags();
  }

  handleSetSort (sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ ascending: !this.state.ascending });
    }
    else {
      this.setState({ sortBy, ascending: true });
    }
  }

  handleSearchTags () {
    let isSearching = !this.state.isSearching;

    this.setState({ isSearching });
    if (isSearching) this.refs.searchbar.focus();
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
    this.setOptions(filteredTags);
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

  setOptions (filteredTags) {
    let { tags } = this.props,
        options = filteredTags.map(id => ({ label: `${tags[id].title}(${tags[id].bookmarks.length})`, value: id })),
        // sort the options to appear alphabetically
        sortedOptions = this.sortOptions(options);

    this.setState({ options: sortedOptions });
  }

  sortOptions (options) {
    return options.sort((a, b) => {
      let aLabel = a.label.toLowerCase(),
          bLabel = b.label.toLowerCase();

      if (aLabel < bLabel) return -1;
      if (aLabel > bLabel) return 1;
      return 0;
    });
  }

  renderSortActions () {
    let { ascending, isSearching, sortBy } = this.state,
        sortBoxStyle = {
          flex: isSearching ? '0' : '4',
        },
        dir = ascending ? 'up' : 'down',
        alphaClasses = classNames('list__button', 'button', 'sort-tags__button-by_alpha', {
          'active': sortBy === 'alpha',
        }),
        numClasses = classNames('list__button', 'button', 'sort-tags__button-by_num', {
          'active': sortBy === 'num',
        }),
        dateClasses = classNames('list__button', 'button', 'sort-tags__button-by_date', {
          'active': sortBy === 'date',
        });

    return (
      <div className='list__sort' style={sortBoxStyle}>
        <button className={alphaClasses} onClick={() => this.handleSetSort('alpha')} title='sort alphabetically'>
          <i className={`fa fa-long-arrow-${sortBy === 'alpha' ? dir : 'up'}`}/>AZ
        </button>
        <button className={numClasses} onClick={() => this.handleSetSort('num')} title='sort numerically'>
          <i className={`fa fa-long-arrow-${sortBy === 'num' ? dir : 'up'}`}/>09
        </button>
        <button className={dateClasses} onClick={() => this.handleSetSort('date')} title='sort by date'>
          <i className={`fa fa-long-arrow-${sortBy === 'date' ? dir : 'up'}`}/>
          <i className='fa fa-calendar-o'/>
        </button>
      </div>
    )
  }

  render () {
    let { ascending, filteredTags, filteredBookmarks, isSearching, options, selectedTags, sortBy } = this.state,
        selected = selectedTags.map(id => (this.props.tags[id])),
        filtered = filteredTags.map(id => (this.props.tags[id])),
        searchIconStyle = {
          flex: isSearching ? '1' : '0',
        },
        searchBoxStyle = {
          flex: isSearching ? '8' : '0',
          overflow: isSearching ? 'visible' : 'hidden',
        };

    return (
      <div className='drawer__content lists'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <div className='list__actions'>
          {this.renderSortActions()}
          <button className='list__button button search-tags' onClick={() => this.handleSearchTags()} style={searchIconStyle} title='search tags'>
            { isSearching ? <i className='fa fa-long-arrow-left'/> : <i className='fa fa-search'/> }
          </button>
          <div className='list__search' style={searchBoxStyle}>
            <Select
              className='list-selector'
              multi={false}
              name='list-select'
              onChange={(selected) => this.handleClickTag(selected.value)}
              options={options}
              placeholder=''
              ref='searchbar'
              value=''
              />
          </div>
        </div>
        <TagList
          handleClickTag={(id) => this.handleClickTag(id)}
          selectedTags={selected}
          tags={filtered}
          sort={{ ascending, sortBy }}
          />
        <h1 className='drawer__header bookmarks__header'>Bookmarks</h1>
        <BookmarkList
          selectedBookmarks={filteredBookmarks}
          />
      </div>
    );
  }
}
