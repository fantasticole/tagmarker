import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * Alert
 *
 * @param {string} [text] - optional alert text
 * @param {string} [title] - optional alert title
 */
const Module = {};

Module.Alert = class Alert extends Component {
  constructor (props) {
    super(props);
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
    return (
      <div className="alert__fill">
        <div className="alert__viewport" ref="viewport">
          <div className="alert__content">
            {this.renderTitle()}
            {this.renderText()}
            {this.props.children}
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
