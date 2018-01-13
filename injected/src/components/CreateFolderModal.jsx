import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

export default class CreateFolderModal extends Component {
  handleClickSubmit () {
    this.props.onSubmit();
    this.handleDeactivate();
  }

  handleDeactivate () {
    this.refs.modal.deactivate();
  }

  render () {
    return (
      <Modal.Modal className='create-folder-modal' ref='modal'>
        <h1 className='create-folder__header'>Add folder in: {this.props.title}</h1>
        <input autoFocus className='create-folder__input modal__input' onChange={(e) => this.props.onChange(e)} type='text' />
        <span className='create-folder__actions'>
          <button className='button create-folder-action__button action-button' onClick={() => this.handleClickSubmit()}>Submit <i className='fa fa-floppy-o'/></button>
          <button className='button create-folder-action__button action-button' onClick={() => this.handleDeactivate()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      </Modal.Modal>
    );
  }
}
