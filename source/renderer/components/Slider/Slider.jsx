import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Switch.less';

function Slider(props) {
    return (
        <label className={classnames(styles.switch)}>
            <input 
                type='checkbox'
                className={classnames(styles.input)}
                onChange={props.onChange}
                checked={props.isChecked}
                name={props.name}
            />
            <div className={classnames(styles.slider, styles.round)} />
        </label>
    )
};

Slider.propTypes = {
    onChange: PropTypes.func.isRequired,
    isChecked: PropTypes.boolean.isRequired,
    name: PropTypes.string.isRequired
};

export { Slider };
