import React from 'react';
import StartButton from 'components/StartButton';
import buttonFactory from 'library/buttonFactory';
import { actions as IPCActions } from 'IPCLibrary';
import { LABELS } from 'constants';
import { withPreventDefault } from 'utilities';

function attachButtons(Component) {
    const buttons = {
        start: StartButton,
        pause: buttonFactory({
            name: 'PauseButton',
            label: LABELS.BUTTONS.PAUSE,
            onClick: withPreventDefault(IPCActions.stop)
        }),
        resume: buttonFactory({ 
            name: 'ResumeButton',
            label: LABELS.BUTTONS.RESUME,
            onClick: withPreventDefault(IPCActions.resume)
        })
    };

    return <Component buttons={ buttons } />;
}

export default attachButtons;