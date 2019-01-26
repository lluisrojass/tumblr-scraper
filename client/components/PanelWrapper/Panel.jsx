import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Panel.css';

const Panel = (props) => (
    <div 
        className={classnames(styles.base, className)} 
        style={{ width: `${width}%` }}
        children={props.children}
    />
);

Panel.propTypes = {
    width: PropTypes.number.isRequired,
    children: PropTypes.any,
    className: PropTypes.string
};

Panel.defaultProps = {
    width: 33
};

export default Panel;