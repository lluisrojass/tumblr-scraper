/* @flow */
import * as React from 'react';
import styles from './index.css';
import Panel from '@ts/base-components/Panel';
import Header from '@ts/components/Header/';
import TypeOptions from '@ts/components/Type-Options';
import Textbox from '@ts/components/Textbox';
import config from '@ts/config';
import '@ts/global-styles';

const Application = () => {
  return (
    <div className={styles.appWrapper}>
      <Panel width={30} className={styles.foregroundPanel}>
        <Header>{ config.title }</Header>
        <TypeOptions />
        <Textbox />
      </Panel>
      <Panel width={35} className={styles.backgroundPanel}></Panel>
      <Panel width={35} className={styles.backgroundPanel}></Panel>
    </div>
  );
};

export default Application;