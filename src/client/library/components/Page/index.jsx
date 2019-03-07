import * as React from 'react';
import styles from './index.css';

type Props = {
  children: any,
  backgroundColor?: string
};

const Page = (props: Props) => {
  const style = props.backgroundColor ? {
    backgroundColor: props.backgroundColor
  } : {};
  return (
    <div style={style} className={styles.wrapper}>
      <div className={styles.pane}>
        { props.children }
      </div>
    </div>
  );
};

export default Page;