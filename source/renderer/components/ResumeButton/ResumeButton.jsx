import React from 'react';
import classnames from 'classnames';
import Button from '../Button/';
import styles from './ResumeButton.css';
import { actions as IPCActions } from 'IPC';
import { LABELS } from 'constants';
import { withPreventDefault } from 'utilities';

class ResumeButton extends React.PureComponent {
    
    onClick(e) {
        withPreventDefault(IPCActions.resume)(e);
    }

    render() {
        return (
            <Button 
                className={classnames(styles.button)}
                onClick={this.onClick}
            >
                {LABELS.RESUME}
            </Button>
        );
    }
}

export { ResumeButton };