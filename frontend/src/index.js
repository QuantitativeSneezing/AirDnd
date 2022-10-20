import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './context/Modal';
import DropdownProvider from './context/DropdownContext';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import * as spotActions from './store/spots'

import './index.css';
const store = configureStore();


if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();
  window.spotActions = spotActions;

  window.sessionActions = sessionActions;
  window.csrfFetch = csrfFetch;
  window.store = store;
}






function Root() {
  return (
    <Provider store={store}>
      <DropdownProvider>
        <ModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ModalProvider>
      </DropdownProvider>
    </Provider>
  );
}
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
