import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Tag from './Tag';

export default class FilteredTags extends Component {
  constructor (props) {
    super(props);
  }

  sort () {
    let { ascending, sortBy } = this.props;

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

  render () {
    let sortedTags = this.props.tags.sort(this.sort());

    return (
      <div className='filtered-tags__list'>
        {
          sortedTags.map(tag => {
            return ( <Tag key={tag.id} onClick={() => this.props.selectTag(tag.id)} tag={tag} />);
          })
        }
      </div>
    );
  }
}
