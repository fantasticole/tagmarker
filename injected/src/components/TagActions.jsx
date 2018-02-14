import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Select from 'react-select';

/**
 * TagActions
 *
 * @param {bool} ascending - direction of sort
 * @param {function} onSort - function to run when sort is clicked
 * @param {string} sortBy - key to sort by
 */
export default class TagActions extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let { ascending, sortBy } = this.props,
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
      <div className='list__actions'>
        <div className='list__sort'>
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
      </div>
    );
  }
}
