/* @flow */
import * as React from 'react';
import styles from './index.css';
import config from '@ts/config';
import Page from '@ts/base-components/Page';
import Box from '@ts/base-components/Box';
import GithubAction from '@ts/base-components/Github-Action';

type Props = {
  message: string
}
const FatalError = (props: Props) => {
  return (
    <Page backgroundColor="rgb(175, 47, 40)">
      <Box
        widthBounds={[300, 500]}
        shadowColor="rgb(112, 55, 49)"
        borderColor="#E44625"
      >
        <div className={styles.spacing}>
          <h1 className={styles.title}>
            { config.labels.errors.fatal.title }
          </h1>
          <p className={styles.message}>
            { config.labels.errors.fatal.message }
            { ` Error: ${props.message}`}
          </p>
          <div className={styles.reportabugWrapper}>
            <GithubAction 
              className={styles.reportabug} 
              label={config.labels.github.issue}
              path={config.external.github.paths.issue}
            />
          </div>
        </div>
      </Box>
    </Page>
  );
};

export default FatalError;