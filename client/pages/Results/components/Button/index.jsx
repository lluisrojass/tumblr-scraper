/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
  children: any,
  className?: string,
};

const Button = (props: Props) => (
  <a className={classnames(styles.button, props.className)}>
    { props.children }
  </a>
);

export default Button;