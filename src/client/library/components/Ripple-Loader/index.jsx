/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
  className?: string,
  color?: string
};

const Pulse = (props: Props) => {
  const circleStyle = props.color ? {
    borderColor: props.color
  } : {};
  return (
    <div className={classnames(styles.ripple, props.className)}>
      <div style={circleStyle} />
      <div style={circleStyle}  />
    </div>
  );
};

export default Pulse;