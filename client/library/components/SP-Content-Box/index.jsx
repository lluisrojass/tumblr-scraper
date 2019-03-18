/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
  children: any,
  className?: string
};

const Box = (props: Props) => (
  <div className={classnames(styles.box, props.className)}>
    { props.children }
  </div>
);

export default Box;