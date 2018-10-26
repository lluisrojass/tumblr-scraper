import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import Application from './components/Application/';
import 'globalCSS';

render(
    <Provider>
        <Application />
    </Provider>,
    document.getElementById('app')
);
