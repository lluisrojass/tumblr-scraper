/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';

type Props = {
    children: any
}

const Header = (props: Props) => (
  <div className={classnames(styles.wrapper)}>
    <h1 className={classnames(styles.header)}>
      { props.children }
    </h1>
  </div>
);

export default Header;