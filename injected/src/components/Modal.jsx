import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

/**
 * Modal
 *
 * @param {jsx} children - elements to wrap in the marquee
 * @param {string} classNames - class names to add to modal
 * @param {function} [onClose] - optional function to run on close
 */
const Module = {};

Module.Modal = class Modal extends Component {
  constructor (props) {
    super(props);
  }
  
  handleClose (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onClose) this.props.onClose();
    else this.deactivate();
  }

  deactivate () {
    ReactDOM.unmountComponentAtNode(document.getElementsByClassName('modal-container')[0]);
  }

  render () {
    let modalClasses = classNames('modal__content', this.props.className);

    return (
      <div className='modal__fill'>
        <div className='modal__viewport' ref='viewport'>
          <button className='button modal__close' onClick={(e) => this.handleClose(e)}>✕</button>
          <div className={modalClasses}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Module.deactivate = () => {
  return ReactDOM.unmountComponentAtNode(document.getElementsByClassName('modal-container')[0]);
};

Module.render = (modal) => {
  return ReactDOM.render(modal, document.getElementsByClassName('modal-container')[0]);
};

module.exports = Module;
