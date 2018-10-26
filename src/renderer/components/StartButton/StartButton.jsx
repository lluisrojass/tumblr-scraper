import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import values from 'lodash/values';
import styles from './StartButton.css';
import Button from '../Button/';
import { Subscribe } from 'unstated';
import BlognameState from 'state/Blogname/';
import NotificationState from 'state/Notification';
import SlidersState from 'state/Sliders';
import { LABELS, NOTIFICATION_TYPES, TUMBLR } from 'constants';
import { sliderTumblrTypeMap } from './utils';
import { exactMatch } from 'utilities';
import { actions as IPCActions } from 'IPCLibrary';

const typeMap = sliderTumblrTypeMap(
    LABELS.SLIDERS,
    TUMBLR.TYPES
);

class StyledButton extends React.PureComponent {

    static propTypes = {
        sliders: PropTypes.array.isRequired,
        blogname: PropTypes.string.isRequired,
        notify: PropTypes.func.isRequired
    }

    shouldStart = () => {
        const { 
            sliders, 
            blogname,
            notify
        } = this.props;
        
        if (blogname.length <= 0) {
            notify(
                NOTIFICATION_TYPES.ERROR, 
                LABELS.BLOGNAME.MISSING 
            );   
        }
        else if (blogname.length > 32) {
            notify(
                NOTIFICATION_TYPES.ERROR,
                LABELS.BLOGNAME.TOO_LONG  
            );
        }
        else if (
            !exactMatch(
                /^[a-zA-Z0-9]+(?:\-*[a-zA-Z0-9])*$/,
                blogname
            )
        ) {
            notify(
                NOTIFICATION_TYPES.ERROR,
                LABELS.BLOGNAME.INVALID
            );
        }
        else {
            const { SLIDERS } = LABELS;
            const { TYPES } = TUMBLR;
            const types = [];

            for (let i = 0 ; i < sliders.length ; ++i) {
                const slider = sliders[i];

                if (slider.value) {
                    if (slider.name === SLIDERS.ALL) {
                        IPCActions.start(blogname, values(TYPES));
                        return;
                    }
                }

                types.push(typeMap[slider.name]);
            }

            if (types.length) {
                IPCActions.start(blogname, types);
            }
        }
    }

    render() {
        return (
            <Button 
                className={classnames(styles.button)}
                onClick={this.shouldStart}
            >
                { LABELS.BUTTONS.START }
            </Button>
        );
    }

}

/* attach state */
const StartButton = () => (
    <Subscribe to={[
        BlognameState, 
        NotificationState,
        SlidersState
    ]}>
        {( 
            blognameState, 
            notificationState,
            sliderState
        ) => (
            <StyledButton 
                blogname={ blognameState.state }
                notify={ notificationState.notify }
                sliders={ sliderState.state.sliders }
            />
        )}
    </Subscribe>
); 

export { StartButton };