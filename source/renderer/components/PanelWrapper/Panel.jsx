import React from 'react';
import { setDisplayName } from 'recompose';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './panel.css';

function PanelWrapper(props) {
    const { width, children, className } = props;
    // TODO: does <section> cause a problem
    return (
        <div className={classnames(styles.base, className)} style={{ width: `${width}%` }}>
            <section>
                {children}
            </section>
        </div> 
    );
}

PanelWrapper.propTypes = {
    width: PropTypes.number.isRequired,
    children: PropTypes.object,
    className: PropTypes.string
};

PanelWrapper.defaultProps = {
    width: 33,
    children: null,
    className: ''
};

export const Panel = setDisplayName('Panel')(PanelWrapper);
