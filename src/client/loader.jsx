/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import FatalError from '@ts/components/Fatal-Error';
import Application from '@ts/components/Application';
import '@ts/lib/css/global.css';

const container: ?HTMLElement = document.getElementById('app');
if (container != null) {
  try {
    render(
      <Provider>
        <Application />
      </Provider>,
      container
    );
  } catch(e) {
    render(
      <FatalError message={e.message} />,
      container
    );
  }
}