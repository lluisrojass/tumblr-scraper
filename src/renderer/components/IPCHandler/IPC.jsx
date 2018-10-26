import React from 'react';
import { Subscribe, Container } from 'unstated';
import { setDisplayName, lifecycle, compose } from 'recompose';

import { IPCController } from 'IPCLibrary';
import { IPC, LABELS, NOTIFICATION_TYPES } from 'constants';
import { attachPathToLabel } from 'utilities';

import DepthState  from 'state/Depth/';
import StatusState from 'state/Status/';
import NotificationState from 'state/Notification/';
import PostsState from 'state/Posts/';
import ViewerState from 'state/Viewer/';
import ThrottleState from 'state/Throttle/';

const Component = compose(
    lifecycle({
        componentDidMount() {
            const { 
                DepthState: depthState,
                StatusState: statusState,
                NotificationState: notificationState,
                PostsState: postsState,
                ThrottleState: throttleState,
                ViewerState: viewerState
            } = this.props;

            const controller = new IPCController();
            const { EVENTS } = IPC;
            
            controller.on(EVENTS.POST_DISCOVERED, (post) => {

                post.isClicked = false;
                postsState.addPost(post);

            }).on(EVENTS.DATE_DISCOVERED, (data) => {

                depthState.setDateDepth(data.date);

            }).on(EVENTS.PAGE_DISCOVERED, (data) => {

                depthState.setPageDepth(data.path);

            }).on(EVENTS.LOOP_TIMEOUT, () => {

                const { TIMEOUT } = LABELS.ERRORS;
                const { ERROR } = NOTIFICATION_TYPES;
                statusState.reset();
                notificationState.notify(ERROR, TIMEOUT);

            }).on(EVENTS.LOOP_END, () => {

                const { SUCCESS } = NOTIFICATION_TYPES;
                const { FINISHED } = LABELS;
                statusState.complete();
                notificationState.notify(SUCCESS, FINISHED);
            
            }).on(EVENTS.LOOP_ERROR, (data) => {

                const { ERROR } = NOTIFICATION_TYPES;
                const label = data.message || LABELS.ERRORS.GENENERIC_FATAL;
                let safeLabel = data.path ? attachPathToLabel(label, data.path) : label;

                statusState.reset();
                notificationState.notify(ERROR, safeLabel);

            }).on(EVENTS.LOOP_WARNING, (data) => {

                const { WARNING } = NOTIFICATION_TYPES;
                const label = data.message || LABELS.ERRORS.GENERIC_NONFATAL;
                let safeLabel = data.path ? attachPathToLabel(label, data.path) : label;

                notificationState.notify(WARNING, safeLabel);

            }).on(EVENTS.RESPONSE.START, () => {

                notificationState.reset();
                postsState.reset();
                viewerState.reset();
                depthState.reset();
                statusState.startRunning();

            }).on(EVENTS.RESPONSE.STOP, () => {

                statusState.pauseRunning();

            }).on(EVENTS.RESPONSE.CONTINUE, (data) => {

                if (data.didContinue) {
                    notificationState.reset();
                    statusState.startRunning();
                }
                else {
                    const { COULD_NOT_CONTINUE } = LABELS.ERRORS;
                    const { ERROR } = NOTIFICATION_TYPES;
                    notificationState.notify(ERROR, COULD_NOT_CONTINUE);
                }

            }).on(EVENTS.RESPONSE.THROTTLE, (val) => {

                throttleState.setThrottleValue(val);
                
            });
        }
    }),
    setDisplayName('IPCHandler')
)(function(){ return null; });

function stateFilterAndRender() {
    const props = {};
    for (let i in arguments) {
        const instance = arguments[i];
        if (!(instance instanceof Container)) {
            continue;
        }
        /* eslint-disable no-unused-vars */
        const { state, ...fns } = instance;
        /* eslint-enable no-unused-vars */
        props[instance.constructor.name] = fns;
    }

    return <Component {...props} />;
}

const IPCHandler = () => (
    <Subscribe to={[ 
        StatusState, 
        DepthState, 
        PostsState, 
        NotificationState, 
        ThrottleState,
        ViewerState
    ]}>
        { stateFilterAndRender }
    </Subscribe>
);

export { IPCHandler };

