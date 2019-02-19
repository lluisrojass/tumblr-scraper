/* @flow */
import * as React from 'react';
import styles from './index.css';

type Props = {
    name: string,
    isChecked: boolean,
    value: string,
    onChange: () => void
}

const Option = (props: Props): React.Element<'div'> => (
    <div>
        <input
            type="checkbox"
            className={styles.checkbox}
            tabIndex={-1}
            checked={props.isChecked}
        />
        <span tabIndex={0} className="label">
            { props.name }
        </span>
    </div>
);

export default Option;