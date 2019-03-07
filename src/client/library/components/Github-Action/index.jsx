/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import Icon from '@ts/lib/icons/github.svg';
import styles from './index.css';

type Props = {
  label: string,
  className?: string
};

export default (props: Props) => (
  <a className={classnames(styles.action, props.className)}>
    <Icon /><span>{ props.label }</span>
  </a>
);