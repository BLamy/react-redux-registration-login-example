import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import users, { authentication, registration } from '../model/user';
import alert from '../model/alert';

const loggerMiddleware = createLogger();

export const store = createStore(
    combineReducers({
        authentication,
        registration,
        users,
        alert
    }),
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);