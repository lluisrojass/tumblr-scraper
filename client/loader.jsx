/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import Application from '@client/Application';
import ErrorBoundry from '@client/pages/Error';
import '@client/library/css/global.css';

const container: ?HTMLElement = document.getElementById('app');
if (container != null) {
  render(
    <ErrorBoundry>
      <Provider>
        <Application />
      </Provider>
    </ErrorBoundry>,
    container
  );
}