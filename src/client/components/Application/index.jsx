/* @flow */
import * as React from 'react';
import styles from './index.css';
/*
import Section from '@ts/base-components/Section';
import Panel from '@ts/base-components/Panel';
import Header from '@ts/components/Header/';
import Textbox from '@ts/components/Textbox';
import Accordion from '@ts/components/Message-Accordion';
import config from '@ts/config';
*/
import TypeOptions from '@ts/components/Type-Options';
import SettingsBox from '@ts/components/Settings-Box';
import Input from '@ts/components/Input';
import '@ts/global-styles';

const Application = () => {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <SettingsBox>
            <Input />
            <div className={styles.contentBottomPanel}>
              <TypeOptions />
            </div>
          </SettingsBox>
        </div>
      </div>
    </div>
  );
};

export default Application;