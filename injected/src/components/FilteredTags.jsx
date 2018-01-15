import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Tag from './Tag';

export default class FilteredTags extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='filtered-tags__list'>
        {
          this.props.tags.map(tag => {
            return ( <Tag key={tag.id} onClick={() => this.props.selectTag(tag.id)} tag={tag} />);
          })
        }
      </div>
    );
  }
}
