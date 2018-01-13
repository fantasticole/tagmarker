import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

export default class CreateBookmarkModal extends Component {
  handleClickSubmit () {
    this.props.onSubmit();
    this.handleDeactivate();
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  render () {
    return (
      <Modal.Modal className='create-bookmark-modal' ref='modal'>
        <h1 className='create-bookmark__header'>Add bookmark in: {this.props.title}</h1>
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.props.name}
          name='name'
          onChange={(e) => this.props.onChange('bookmarkName', e)}
          type='text'
          />
        <input
          className='create-bookmark__input modal__input'
          defaultValue={this.props.url}
          name='url'
          onChange={(e) => this.props.onChange('bookmarkUrl', e)}
          type='text'
          />
        <span className='create-bookmark__actions'>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button create-bookmark-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
