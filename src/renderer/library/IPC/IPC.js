const { ipcRenderer } = electronRequire('electron');/* TODO: is this necessary with webpack? */
import { IPC } from 'constants';
import values from 'lodash/values';
const { PACKAGE, EVENTS, REQUESTS } = IPC;


class IPCController {

    replyEvents = values(EVENTS.RESPONSE);

    on = (EVENT_TYPE, handler) => {
        
        if (this.replyEvents.includes(EVENT_TYPE)) {
            ipcRenderer.on(IPC.PACKAGE.ASYNC_REPLY, function(event, RECV_EVENT, data) {
                switch(RECV_EVENT) {
                    case EVENT_TYPE: {
                        handler(data);
                    }
                }
            });
        }
        else {
            ipcRenderer.on(EVENT_TYPE, handler);
        }

        return this;
    }
}

/* API of actions that can be sent */
/* to the loop process */
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
    openInBrowser(url) {
        ipcRenderer.send(
            PACKAGE.ASYNC_REQUEST,
            REQUESTS.OPEN_IN_BROWSER,
            { url: url }
        );
    }
};

export { IPCController, actions };
