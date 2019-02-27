/* @flow */
import * as React from 'react';
import { noop } from '@ts/lib/utils/common';
import styles from './index.css';

type Props = {
    name: string,
    isChecked: boolean,
    value: string,
    onClick: (number) => Promise<void>
}

const Option = (props: Props) => (
  <div className={styles.container}>
    <input
      type="checkbox"
      className={styles.checkbox}
      tabIndex={-1}
      checked={props.isChecked}
      onChange={noop}
    />
    <span 
      onClick={props.onClick}
      tabIndex={0} 
      className={styles.label}>
      { props.name }
    </span>
  </div>
);

export default Option;