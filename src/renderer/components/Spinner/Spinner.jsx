import React from 'react';
import classnames from 'classnames';
import styles from './Spinnner.css';

function Spinner() {
    return (
        <div className={classnames(styles.fadingCircle)}>
            {new Array(12).forEach((_, index) => (
                <div className={classnames(styles.circle, styles['circle' + index])} />
            ))}
        </div>
    );
}

export { Spinner };
