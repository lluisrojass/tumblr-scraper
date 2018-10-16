const { ipcRenderer } = electronRequire('electron');/* TODO: is this necessary with webpack? */
import { IPC } from 'constants';
const { PACKAGE, REQUESTS } = IPC;

class IPCController {
    on(EVENT_TYPE, handler) {
        if (IPC.RESPONSE.includes(EVENT_TYPE)) {
            ipcRenderer.on(IPC.PACKAGE.ASYNC_REPLY, function(event, RECV_EVENT, data) {
                switch(RECV_EVENT) {
                    case EVENT_TYPE: {
                        handler(data);
                    }
                }
            });
        }
        else {
            ipcRenderer.on(EVENT_TYPE, (event, data) => handler);
        }

        return this;
    }
}

const actions = {
    toggleThrottle() {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST, 
            REQUESTS.THROTTLE
        );
    },
    start(blogname, types) {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            REQUESTS.START, 
            { blogname, types }
        );
    },
    stop() {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            REQUESTS.STOP
        );
    },
    resume() {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            REQUESTS.CONTINUE
        );
    },
    imageLoaded() {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            IPC.EVENTS.IMAGE_LOADED
        );
    },
    openInBrowser() {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            REQUESTS.OPEN_IN_BROWSER
        );
    }
};

export { IPCController, actions };
