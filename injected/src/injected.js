import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';

import Drawer from './containers/Drawer';

import 'react-select/dist/react-select.css';
import './injected.scss';
import 'font-awesome/css/font-awesome.css';

export const proxyStore =  new Store({
  state: {},
  portName: 'tagmarker'
});

const unsubscribe = proxyStore.subscribe(() => {
   unsubscribe(); // make sure to only fire once
   render(
    <Provider store={proxyStore}>
      <Drawer/>
    </Provider>
    , document.getElementById('tags'));
});
