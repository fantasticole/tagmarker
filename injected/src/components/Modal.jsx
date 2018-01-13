import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Module = {};

Module.Modal = class Modal extends Component {
  constructor(props) {
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
    return (
      <div className="modal__fill">
        <div className="modal__viewport" ref="viewport">
          <button className="button modal__close" onClick={(e) => this.handleClose(e)}>✕</button>
          <div className="modal__content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Module.render = (modal) => {
  return ReactDOM.render(modal, document.getElementsByClassName('modal-container')[0]);
};

module.exports = Module;
