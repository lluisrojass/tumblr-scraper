import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Button.less';

const Button = (props) => (
    <button 
        className={classnames(styles.button, props.className)} 
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

Button.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export { Button };