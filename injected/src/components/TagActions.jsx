import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';
import Select from 'react-select';

/**
 * TagActions
 *
 * @param {bool} ascending - direction of sort
 * @param {function} filteredTags - list of tag objects
 * @param {function} onSort - function to run when sort is clicked
 * @param {function} selectTag - function to run when tag is selected
 * @param {string} sortBy - key to sort by
 */
export default class TagActions extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isSearching: false,
      options: [],
    };
  }

  componentDidMount () {
    this.setOptions(this.props.filteredTags);
  }

  componentDidUpdate (prevProps) {
    let oldTagCount = prevProps.filteredTags.length,
        newTagCount = this.props.filteredTags.length;

    // if the selected tag count changed, update select options
    if (oldTagCount !== newTagCount) this.setOptions();
  }

  handleSearchTags () {
    let isSearching = !this.state.isSearching;

    this.setState({ isSearching });
    if (isSearching) this.refs.searchbar.focus();
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

  renderSortActions () {
    let { isSearching } = this.state,
        { ascending, sortBy } = this.props,
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
        <button className={alphaClasses} onClick={() => this.props.onSort('alpha')} title='sort alphabetically'>
          <i className={`fa fa-long-arrow-${sortBy === 'alpha' ? dir : 'up'}`}/>AZ
        </button>
        <button className={numClasses} onClick={() => this.props.onSort('num')} title='sort numerically'>
          <i className={`fa fa-long-arrow-${sortBy === 'num' ? dir : 'up'}`}/>09
        </button>
        <button className={dateClasses} onClick={() => this.props.onSort('date')} title='sort by date'>
          <i className={`fa fa-long-arrow-${sortBy === 'date' ? dir : 'up'}`}/>
          <i className='fa fa-calendar-o'/>
        </button>
      </div>
    )
  }

  render () {
    let { isSearching, options } = this.state,
        searchIconStyle = {
          flex: isSearching ? '1' : '0',
        },
        searchBoxStyle = {
          flex: isSearching ? '8' : '0',
          overflow: isSearching ? 'visible' : 'hidden',
        };

    return (
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
            onChange={(selected) => this.props.selectTag(selected.value)}
            options={options}
            placeholder=''
            ref='searchbar'
            value=''
            />
        </div>
      </div>
    );
  }
}
