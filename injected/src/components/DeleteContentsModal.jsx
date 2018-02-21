import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import FolderSelection from './FolderSelection';
import Modal from './Modal';

import ifTrue from '../utils/ifTrue';

/**
 * DeleteContentsModal
 *
 * @param {string} folder - id of parent folder in question
 * @param {array} toRemove - list of items staged for removal
 */
export default class DeleteContentsModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      allSelected: true,
      toDelete: this.props.toRemove.map(item => item.id),
      parentId: null,
    }
  }

  handleClickCancel () {
    this.refs.modal.deactivate();
  }

  handleClickSubmit () {
    let { toDelete, parentId } = this.state;

    console.log({toDelete})
    console.log({parentId})
    // delete selected ids from chrome, which will update the
    // store from the background
    // this.state.toDelete.forEach(id => chrome.bookmarks.remove(id));
  }

  handleSetParent (parentId) {
    this.setState({ parentId });
  }

  handleToggleAll () {
    let allSelected = !this.state.allSelected,
        toDelete = [];

    // if everything is selected, toDelete should be set to all possible ids
    if (allSelected) toDelete = this.props.toRemove.map(item => item.id);
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
  }

  render () {
    let { folder, toRemove } = this.props,
        { allSelected, toDelete, parentId } = this.state,
        deletingParent = toDelete.includes(folder),
        notDeletingAll = toDelete.length < toRemove.length,
        // only allow submission if we have everything we need
        canSubmit = (deletingParent && !notDeletingAll) || parentId,
        selectClasses = classNames('delete-staging__select', {
          'visible': (deletingParent && notDeletingAll),
        }),
        itemClasses = {
          'bookmark': 'fa fa-bookmark-o',
          'tag': 'fa fa-folder',
        };

    return (
      <Modal.Modal className='delete-modal delete__staging' ref='modal'>
        <h2 className='modal__header'>delete from chrome</h2>
        <div className={selectClasses}>
          <FolderSelection onSelect={(selected) => this.handleSetParent(selected)}/>
        </div>
        {ifTrue(toRemove.length > 1).render(() => (
          <div className='delete-staging__header'>
            <input checked={allSelected} className='delete-staging__checkbox' onChange={() => this.handleToggleAll()} type='checkbox'/>
            <p className='delete-staging__title'>select all</p>
          </div>
        ))}
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
                  <i className={itemClasses[type]}/>
                  {title}
                </span>
              </li>
            );
          })}
        </ul>
        <div className='modal__actions'>
          <button className='button action-button modal-action__button' disabled={!canSubmit} onClick={() => this.handleClickSubmit()}>delete selected</button>
          <button className='button action-button modal-action__button' onClick={() => this.handleClickCancel()}>keep all</button>
        </div>
      </Modal.Modal>
    );
  }
}
