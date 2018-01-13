import React, { Component } from 'react';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';
import Select from 'react-select';

export default class TagList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ascending: true,
      isSearching: false,
      options: [],
      sortBy: 'alpha',
    };
  }

  componentDidMount () {
    this.setOptions(this.props.filteredTags);
  }

  componentDidUpdate (prevProps) {
    let oldTagCount = prevProps.filteredTags.length,
        newTagCount = this.props.filteredTags.length;

    if (oldTagCount !== newTagCount) {
      this.setOptions();
    }
  }

  handleSearchTags () {
    let isSearching = !this.state.isSearching;

    this.setState({ isSearching });
    if (isSearching) this.refs.searchbar.focus();
  }

  handleSetSort (sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ ascending: !this.state.ascending });
    }
    else {
      this.setState({ sortBy, ascending: true });
    }
  }

  handleSort () {
    let { sortBy, ascending } = this.state;

    return (a, b) => {
      // make the sort direction dynamic
      let num = ascending ? -1 : 1,
          aProp,
          bProp;

      switch (sortBy) {
        // if we're sorting alphabetically, 
        case 'alpha':
          // let the prop be the title
          aProp = a.title.toLowerCase();
          bProp = b.title.toLowerCase();
          break;
        // if numerically
        case 'num':
          // the amount of bookmarks
          aProp = a.bookmarks.length;
          bProp = b.bookmarks.length;
          break;
        // if by date
        case 'date':
          // the the dateAdded
          aProp = a.dateAdded;
          bProp = b.dateAdded;
      }

      if (aProp < bProp) return num;
      if (aProp > bProp) return -num;
      // if the props are the same, sort them alphabetically
      if (sortBy !== 'alpha' && aProp === bProp) {
        return a.title.toLowerCase() < b.title.toLowerCase() ? num : -num;
      }
      return 0;
    }
  }

  setOptions () {
    let { filteredTags } = this.props,
        options = filteredTags.map(tag => ({ label: `${tag.title}(${tag.bookmarks.length})`, value: tag.id })),
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

  renderTags (allTags, selectedIds) {
    let tags = allTags.map(tag => {
      let tagClasses = classNames('tag', {
            'selected': selectedIds.includes(tag.id),
          });

      return (
        <li
          className='tag-item'
          key={tag.id}
          onClick={() => this.props.onClickTag(tag.id)}
          >
          <MarqueeWrapper>
            <p className={tagClasses}>
              {tag.title} <span className='tagCount'>{tag.bookmarks.length}</span>
            </p>
          </MarqueeWrapper>
        </li>
      );
    })

    // if we have both selected and unselected tags
    if (selectedIds.length && this.props.tags.length > 0) {
      // add divider between the two sets
      tags.splice(selectedIds.length, 0, <div key='divider' className='divider'/>);
    }
    return tags;
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
    let { isSearching, options } = this.state,
        { selectedTags, filteredTags } = this.props,
        sortedTags = filteredTags.sort(this.handleSort()),
        allTags = selectedTags.concat(sortedTags),
        selectedIds = selectedTags.map(t => (t.id)),
        searchIconStyle = {
          flex: isSearching ? '1' : '0',
        },
        searchBoxStyle = {
          flex: isSearching ? '8' : '0',
          overflow: isSearching ? 'visible' : 'hidden',
        }

    return (
      <div className='tag-list__container'>
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
              onChange={(selected) => this.props.onClickTag(selected.value)}
              options={options}
              placeholder=''
              ref='searchbar'
              value=''
              />
          </div>
        </div>
        <ul className='tagmarker-list tag-list'>
          {this.renderTags(allTags, selectedIds)}
        </ul>
      </div>
    );
  }
}
