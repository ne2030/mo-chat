import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import chatReducer from './reducers/chatReducer.js';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger();

export default function(preloadedState) {
  return createStore(
    chatReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
}
