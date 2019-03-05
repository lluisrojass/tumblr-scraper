/* @flow */
import * as React from 'react';
import styles from './index.css';
/*
import Section from '@ts/base-components/Section';
import Panel from '@ts/base-components/Panel';
import Header from '@ts/components/Header/';
import Textbox from '@ts/components/Textbox';
import config from '@ts/config';
*/
import BlogSlider from '@ts/components/Blog-Type-Slider';
import TypeOptions from '@ts/components/Type-Options';
import SettingsBox from '@ts/components/Settings-Box';
import Input from '@ts/components/Input';
import '@ts/global-styles';
import GithubIcon from '@ts/lib/icons/github.svg';

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
          <GithubIcon className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default Application;