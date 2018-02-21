import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * AlertModule
 *
 * @param {string} [content] - optional alert content
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

  renderContent () {
    if (this.props.content) {
      return (<div className='alert__content'>{this.props.content}</div>)
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
          <div className="alert__info">
            {this.renderTitle()}
            {this.renderContent()}
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
