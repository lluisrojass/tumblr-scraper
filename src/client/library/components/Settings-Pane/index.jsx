import * as React from 'react';
import styles from './index.css';

type Props = {
  children: any
};

const SettingsPane = (props: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.pane}>
        { props.children }
      </div>
    </div>
  );
};

export default SettingsPane;