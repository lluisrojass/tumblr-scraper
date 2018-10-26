import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './ButtonComposer.css';
import { Subscribe } from 'unstated';
import StatusState from 'state/Status';

class ButtonsComponent extends React.PureComponent {

    static propTypes = {
        buttons: PropTypes.object.isRequired,
        isRunning: PropTypes.bool.isRequired,
        isExecuting: PropTypes.bool.isRequired
    }

    render() {
        const { 
            pause: PauseButton = null, 
            resume: ResumeButton = null, 
            start: StartButton = null
        } = this.props.buttons;

        return (
            <div className={classnames(styles.wrapper)}>
                {this.props.isRunning ? <PauseButton /> : <StartButton />}
                {!this.props.isRunning && this.props.isExecuting && <ResumeButton />}
            </div>
        );
    }

} 

const Buttons = (props) => (
    <Subscribe to={[ StatusState ]}>
        {(statusState) => (
            <ButtonsComponent 
                isRunning={statusState.state.isRunning}
                isExecuting={statusState.state.isExecuting}
                { ...props }
            />
        )}
    </Subscribe>
);

export { Buttons };