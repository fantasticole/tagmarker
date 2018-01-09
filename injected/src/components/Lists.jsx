import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Select from 'react-select';
import BookmarkList from './BookmarkList';
import TagList from './TagList';

class Lists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ascending: true,
      filteredBookmarks: [],
      filteredTags: Object.values(this.props.tags),
      isSearching: false,
      selectedTags: [],
      sortBy: 'alpha',
      options: [],
    };
  }

  componentDidMount () {
    this.loadBookmarks();
    this.setOptions(this.state.filteredTags);
  }

  handleClickTag (id) {
    let { selectedBookmarks, selectedTags } = this.state,
        { relations, tags } = this.props,
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
          return arr.concat(relations[tagId]);
        }, [])
      ));
      // only keep the ones that appear in all related arrays
      filteredTags = relatedTags
        .filter(tagId => {
          // ignore any tags included in selected array
          if (!selectedTags.includes(tagId)) {
            return selectedTags.every(id => relations[id].includes(tagId));
          }
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

  handleSetSort (sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ ascending: !this.state.ascending });
    }
    else {
      this.setState({ sortBy, ascending: true });
    }
  }

  handleSearchTags () {
    this.setState({ isSearching: !this.state.isSearching });
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
        });

    return (
      <div className='list__sort' style={sortBoxStyle}>
        <button className={alphaClasses} onClick={() => this.handleSetSort('alpha')} title='sort alphabetically'>
          <i className={`fa fa-long-arrow-${sortBy === 'alpha' ? dir : 'up'}`}/>AZ
        </button>
        <button className={numClasses} onClick={() => this.handleSetSort('num')} title='sort numerically'>
          <i className={`fa fa-long-arrow-${sortBy === 'num' ? dir : 'up'}`}/>09
          </button>
      </div>
    )
  }

  render () {
    let { ascending, filteredTags, filteredBookmarks, isSearching, options, selectedTags, sortBy } = this.state,
        selected = selectedTags.map(id => (this.props.tags[id])),
        searchIconStyle = {
          flex: isSearching ? '1' : '0',
        },
        searchBoxStyle = {
          flex: isSearching ? '4' : '0',
          overflow: isSearching ? 'visible' : 'hidden',
        };

    return (
      <div className='drawer__content lists'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <div className='list__actions'>
          {this.renderSortActions()}
          <button className='list__button button search-tags' onClick={() => this.handleSearchTags()} style={searchIconStyle} title='search tags'>
            <i className='fa fa-search'/>
          </button>
          <div className='list__search' style={searchBoxStyle}>
            <Select.Creatable
              autoFocus={isSearching}
              className='list-selector'
              multi={false}
              name='list-select'
              onChange={(selected) => this.handleClickTag(selected.value)}
              openOnFocus={true}
              options={options}
              placeholder=''
              value=''
              />
          </div>
        </div>
        <TagList
          handleClickTag={(id) => this.handleClickTag(id)}
          selectedTags={selected}
          tags={filteredTags}
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

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    relations: state.relations,
    tags: state.tags,
  };
}
export default connect(mapStateToProps)(Lists);
