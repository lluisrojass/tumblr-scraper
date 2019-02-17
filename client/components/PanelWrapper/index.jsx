import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.css';

const Panel = (props) => (
    <div 
        className={classnames(styles.base, props.className)} 
        style={{ width: `${props.width}%` }}
    >
        { props.children }
    </div>
);

Panel.propTypes = {
    width: PropTypes.number.isRequired,
    children: PropTypes.any,
    className: PropTypes.string
};

Panel.defaultProps = {
    width: 33,
    children: null
};

export default Panel;