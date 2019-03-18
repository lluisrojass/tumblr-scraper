/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
  children: any,
  className?: string
};

const Page = (props: Props) => (
  <div className={classnames(styles.wrapper, props.className)}>
    <div className={styles.pane}>
      { props.children }
    </div>
  </div>
);

export default Page;