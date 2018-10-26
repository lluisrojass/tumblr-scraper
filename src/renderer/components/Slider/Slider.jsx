import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Slider.less';

function Slider(props) {
    return (
        <div onClick={props.onChange} className={classnames(styles.switch)}>
            <input
                className={classnames(styles.input)}
                type='checkbox' 
                checked={props.isChecked}
                onChange={props.onChange}
                name={props.name}
            />
            <label className={classnames(styles.green, styles.label)} />
        </div>
    );
}

Slider.propTypes = {
    onChange: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
};

export { Slider };
