import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unstated';
import log from 'electron-log';
import assert from 'assert';
import FatalError from '@ts/components/FatalError';
import Application from '@ts/components/Application';
import S from '@ts/lib/css/global.css';

try {
    let port = extractPort();
    render(
        <Provider>
            <Application port={port} />
        </Provider>,
        document.getElementById('app')
    );
} catch (e) {
    log.error(e);
    render(
        <FatalError message={e.message} />,
        document.getElementById('app')
    );
}


function extractPort() {
    const possiblePortArg = process.argv[process.argv.length - 1] || '';
    let [,port] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
    assert(!!port, 'client startup error, invalid argv port argument recieved ');
    port = port >>> 0;
    assert(port >= 0x400 && port <= 0xFFFF, 'client startup error, '+
    'incorrectly formatted port argument recieved');
    return port;
}