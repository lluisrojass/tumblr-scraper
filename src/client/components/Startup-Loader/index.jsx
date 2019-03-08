/* @flow */
import * as React from 'react';
import Loader from '@ts/base-components/Ripple-Loader';
import Page from '@ts/base-components/Page';
import styles from './index.css';

const StartupLoader = () => (
  <Page>
    <div className={styles.wrapper}>
      <div className={styles.rippleWrapper}>
        <Loader color='rgb(156, 173, 178)' />
      </div>
      <span>Loading</span>
    </div>
  </Page>
);

export default StartupLoader;