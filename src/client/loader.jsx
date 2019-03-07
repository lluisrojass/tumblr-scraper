/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import Application from '@ts/components/Application';
import ErrorBoundry from '@ts/components/Error-Boundry';
import '@ts/lib/css/global.css';

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