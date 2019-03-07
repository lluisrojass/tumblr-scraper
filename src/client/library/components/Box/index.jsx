import * as React from 'react';
import styles from './index.css';

type Props = {
  children: any,
  widthBounds?: Array<number>,
  shadowColor?: string,
  borderColor?: string
};

const Box = (props: Props) => {
  const style = {};
  if (props.widthBounds) {
    const [minWidth, maxWidth] = props.widthBounds;
    Object.assign(style,{
      minWidth,
      maxWidth
    });
  }
  if (props.shadowColor) {
    Object.assign(style, {
      boxShadow: `0 2px 6px ${props.shadowColor}`
    });
  }
  if (props.borderColor) {
    Object.assign(style, {
      border: `1px solid ${props.borderColor}`
    });
  }

  return (
    <div style={style} className={styles.box}>
      { props.children }
    </div>
  );
};

export default Box;