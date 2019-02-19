/* @flow */
import * as React from 'react';
import { render } from 'react-dom';
import assert from 'assert';
import log from 'electron-log';
import { Provider } from 'unstated';
import FatalError from '@ts/components/FatalError';
import Application from '@ts/components/Application';
import S from '@ts/lib/css/global.css';

const container: ?HTMLElement = document.getElementById('app');
if (container != null) {
    try {
        renderApp(container);
    } catch(e) {
        renderError(container, e);
    }
}

function renderError(container: Element, e: Error) {
    render(
        <FatalError message={e.message} />,
        container
    );
}

function renderApp(container: Element) {
    const port: number = extractPort();
    render(
        <Provider>
            <Application port={port} />
        </Provider>,
        container
    );
}

function extractPort(): number {
    const possiblePortArg: string = process.argv[process.argv.length - 1] || '';
    let [,port: ?string] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
    assert(!!port, 'client startup error, invalid argv port argument recieved ');
    let portNum: number = Number(port);
    assert(portNum >= 0x400 && portNum <= 0xFFFF, 'client startup error, '+
    'incorrectly formatted port argument recieved');
    return portNum;
}
