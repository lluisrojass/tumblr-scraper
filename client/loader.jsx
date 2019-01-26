import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import log from 'electron-log';
import assert from 'assert';
import FatalError from 'components/FatalError';
// import Application from './components/Application/';

let port;
try {
    port = extractPort();
    renderApp(port);
} catch(e) {
    log.error(e.message);
    renderStartupError(e.message);
}

function renderStartupError(message) {
    render(
        <FatalError message={message} />,
        document.getElementById('app')
    );
}

function renderApp(port) {
    render(
        <Provider>
            <Application port={port} />
        </Provider>,
        document.getElementById('app')
    );
}

function extractPort() {
    const possiblePortArg = process.argv[process.argv.length - 1] || "";
    let [,port] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
    assert(!!port, 'client startup error, invalid argv port argument recieved ');
    port = port >>> 0;
    assert(port >= 0x400 && port <= 0xFFFF, 'client startup error, '+
    'incorrectly formatted port argument recieved');
    return port;
}