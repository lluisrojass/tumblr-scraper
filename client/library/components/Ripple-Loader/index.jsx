/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
  className?: string
};

const Pulse = (props: Props) => {
  return (
    <div className={classnames(styles.ripple, props.className)}>
      <div />
      <div />
    </div>
  );
};

export default Pulse;