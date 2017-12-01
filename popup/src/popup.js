import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Store} from 'react-chrome-redux';

import App from './components/App';
import logToConsole from '../utils/logToConsole';

const proxyStore =  new Store({
  state: {},
  portName: 'test'
});


render(
  <Provider store={proxyStore}>
    <App/>
  </Provider>
  , document.getElementById('tags')
);

logToConsole('proxyStore:', proxyStore)
