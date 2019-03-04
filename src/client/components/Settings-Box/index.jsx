import * as React from 'react';
import styles from './index.css';

type Props = {
  children: any
};

const SettingsBox = (props: Props) => {
  return (
    <div className={styles.box}>
      { props.children }
    </div>
  );
};

export default SettingsBox;