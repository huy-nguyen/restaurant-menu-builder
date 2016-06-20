import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './components/Root';
import getConfiguredStore from './getConfiguredStore';

/** This file is the entry point for the application */

const store = getConfiguredStore();
ReactDOM.render(
  <Root store={store}/>,
  document.getElementById('app-container')
);
