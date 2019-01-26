import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Header.css';

const Header = (props) => (
    <div className={classnames(styles.wrapper)}>
        <h1 className={classnames(styles.header)}>
            { props.children }
        </h1>
    </div>
);

Header.propTypes = {
    children: PropTypes.any
};

export default Header;