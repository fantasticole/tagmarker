import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Tag from './Tag';

export default class SelectedTags extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let listClasses = classNames('selected-tags__list', {
          'empty': this.props.tags.length === 0,
        });

    return (
      <div className={listClasses}>
        {
          this.props.tags.map(tag => {
            return ( <Tag key={tag.id} onClick={() => this.props.removeTag(tag.id)} tag={tag} isSelected />);
          })
        }
      </div>
    );
  }
}
