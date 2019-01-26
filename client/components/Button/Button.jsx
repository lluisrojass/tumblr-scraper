import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Button.css';
import { noop } from 'lib/utils';

const Button = (props) => (
    <button 
        className={classnames(styles.button, props.className)} 
        onClick={props.onClick}
        children={ props.children }
    />
);

Button.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

Button.defaultProps = {
    onClick: noop
}

export { Button };