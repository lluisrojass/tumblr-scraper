import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Button.css';
import { Subscribe } from 'unstated';
import StatusState from 'state/Status';
import StartButon from '../StartButton/';
import PauseButton from '../PauseButton/';
import ResumeButon from '../ResumeButton/';

class ButtonsComponent extends React.PureComponent {

    static propTypes = {
        isRunning: PropTypes.bool.isRequired,
        isExecuting: PropTypes.bool.isRequired
    }

    render() {
        return (
            <div className={classnames(styles.wrapper)}>
                {this.props.isRunning ? <PauseButton /> : <StartButon />}
                {!this.props.isRunning && this.props.isExecuting && <ResumeButon />}
            </div>
        );
    }

} 

const Buttons = () => (
    <Subscribe to={[ StatusState ]}>
        {(statusState) => (
            <ButtonsComponent 
                isRunning={statusState.state.isRunning}
                isExecuting={statusState.state.isExecuting}
            />
        )}
    </Subscribe>
);

export { Buttons };