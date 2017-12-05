import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';

import Drawer from './components/Drawer';

import './injected.scss';

const proxyStore =  new Store({
  state: {},
  portName: 'tagmarker'
});


render(
  <Provider store={ proxyStore }>
    <Drawer/>
  </Provider>
  , document.getElementById('tags')
);
