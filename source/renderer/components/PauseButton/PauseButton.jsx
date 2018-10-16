import React from 'react';
import classnames from 'classnames';
import Button from '../Button/';
import styles from './Stopbutton.css';
import { actions as IPCActions } from 'IPC';
import { LABELS } from 'contants';
import { withPreventDefault } from 'utilities';

class PauseButton extends React.PureComponent {

    onClick(e) {
        withPreventDefault(IPCActions.stop)(e);
    }

    render() {
        return (
            <Button
                className={classnames(styles.className)}
                onClick={this.onClick} 
            >
                {LABELS.BUTTONS.START}
            </Button>
        );
    }

}

export { PauseButton };