import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { alias } from 'react-chrome-redux';
 
import aliases from './aliases';
import initialState from './initialState';

export default createStore(reducers, initialState, applyMiddleware(alias(aliases), thunk, logger));
// export default createStore(reducers, initialState, applyMiddleware(alias(aliases), thunk));
