import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Loader extends Component {
  render () {
    return (
      <div className='loader-container'>
        <div className='loader' />
      </div>
    );
  }
}
