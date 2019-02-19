/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
    width: number,
    children?: any,
    className?: string
}

const Panel = (props: Props): React.Element<'div'> => (
    <div 
        className={classnames(styles.base, props.className)}  
        style={{ width: `${props.width}%` }}
    >
        { props.children }
    </div>
);

export default Panel;