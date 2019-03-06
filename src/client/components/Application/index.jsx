/* @flow */
import * as React from 'react';
import styles from './index.css';
import SettingsPane from '@ts/base-components/Settings-Pane';
import SettingsBox from '@ts/base-components/Settings-Box';
import TypeOptions from '@ts/components/Type-Options';
import Input from '@ts/components/Input';
import '@ts/global-styles';
import ForkMe from '@ts/base-components/Fork-Me-Icon';

const Application = () => {
  return (
    <div className={styles.appWrapper}>
      <SettingsPane>
        <SettingsBox>
          <Input />
          <TypeOptions />
        </SettingsBox>
      </SettingsPane>      
      <ForkMe />
    </div>
  );
};

export default Application;