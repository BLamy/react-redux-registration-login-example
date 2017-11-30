import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store, configureFakeBackend } from './_helpers';
import App from './controller/App';

// setup fake backend
configureFakeBackend();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);