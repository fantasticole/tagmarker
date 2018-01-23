import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * Alert
 *
 * @param {jsx} children - elements to wrap in the marquee
 * @param {function} [onClose] - optional function to run on close
 */
const Module = {};

Module.Alert = class Alert extends Component {
  constructor (props) {
    super(props);
  }

  handleClickOk () {
    console.log('ok!')
  }

  handleClickCancel () {
    console.log('cancel!')
  }
  
  handleClose (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onClose) this.props.onClose();
    else this.deactivate();
  }

  deactivate () {
    ReactDOM.unmountComponentAtNode(document.getElementsByClassName('alert-container')[0]);
  }

  renderText () {
    if (this.props.text) {
      return (<p className='alert__text'>{this.props.text}</p>)
    }
  }
  
  renderTitle () {
    if (this.props.title) {
      return (<h2 className='alert__header'>{this.props.title}</h2>)
    }
  }

  render () {
    let buttonText = (this.props.buttonText || 'ok');

    return (
      <div className="alert__fill">
        <div className="alert__viewport" ref="viewport">
          <div className="alert__content">
            {this.renderTitle()}
            {this.renderText()}
            <div className='alert__actions'>
              <button className="button action-button alert-action__button" onClick={() => this.handleClickOk()}>{buttonText}</button>
              <button className="button action-button alert-action__button" onClick={() => this.handleClickCancel()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Module.render = (alert) => {
  return ReactDOM.render(alert, document.getElementsByClassName('alert-container')[0]);
};

module.exports = Module;
