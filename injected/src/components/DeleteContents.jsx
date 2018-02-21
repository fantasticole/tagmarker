import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * DeleteContents
 *
 * @param {function} toggleItems - function to toggle selected items
 * @param {array} toRemove - list of items staged for removal
 */
export default class DeleteContents extends Component {
  constructor (props) {
    super(props);

    this.state = {
      allSelected: true,
      toDelete: [],
    }
  }

  handleToggleAll () {
    let allSelected = !this.state.allSelected,
        toDelete = [];

    // if everything is selected, toDelete should be set to all possible ids
    if (allSelected) toDelete = this.props.toRemove.map(item => item.id);
    // send the items to delete back to the alert
    this.props.toggleItems(toDelete);
    // update the state
    this.setState({ allSelected, toDelete });
  }

  handleToggleItem (id) {
    let { toDelete } = this.state;

    // if the id is in our toDelete array, filter it out
    if (toDelete.includes(id)) toDelete = toDelete.filter(item => item !== id);
    // otherwise, add it in
    else toDelete.push(id);
    this.setState({ allSelected: false, toDelete });
    this.props.toggleItems(toDelete)
  }

  render () {
    let { toggleItems, toRemove } = this.props,
        { allSelected, toDelete } = this.state,
        classNames = {
          'bookmark': 'fa fa-bookmark-o',
          'tag': 'fa fa-folder',
        };

    return (
      <div className='delete__staging'>
        <div className='delete-staging__header'>
          <input checked={allSelected} className='delete-staging__checkbox' onChange={() => this.handleToggleAll()} type='checkbox'/>
          <p className='delete-staging__title'>select all</p>
        </div>
        <ul className='delete-staging__list'>
          {toRemove.map(item => {
            let { id, title, type } = item,
                checked = (allSelected || toDelete.includes(id));

            return (
              <li className={`${type}--to_delete delete-staging__list-item`} key={id}>
                <input
                  checked={checked}
                  className='delete-staging__checkbox'
                  onChange={() => this.handleToggleItem(id)}
                  type='checkbox'
                  />
                <span>
                  <i className={classNames[type]}/>
                  {title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
