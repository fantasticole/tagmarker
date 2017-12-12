import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// export default createStore(reducers, {});
export default createStore(reducers, {}, applyMiddleware(logger, thunk));
// export default createStore(reducers, {}, applyMiddleware(thunk));