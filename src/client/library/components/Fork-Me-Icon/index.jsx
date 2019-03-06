/* @flow */
import * as React from 'react';
import Icon from '@ts/lib/icons/github.svg';
import styles from './index.css';

export default () => (
  <a className={styles.forkme}>
    <Icon /><span>Fork Me!</span>
  </a>
);