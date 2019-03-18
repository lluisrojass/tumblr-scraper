/* @flow */
import * as React from 'react';
import RippleLoader from '@client/library/components/Ripple-Loader';
import PageWrapper from '@client/library/components/SP-Wrapper';
import styles from './index.css';

const StartupLoader = () => (
  <PageWrapper>
    <div className={styles.wrapper}>
      <div className={styles.rippleWrapper}>
        <RippleLoader className={styles.ripple} />
      </div>
      <span>Loading</span>
    </div>
  </PageWrapper>
);

export default StartupLoader;