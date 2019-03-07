/* @flow */
import * as React from 'react';
import styles from './index.css';
import Page from '@ts/base-components/Page';
import Box from '@ts/base-components/Box';
import TypeOptions from '@ts/components/Type-Options';
import Input from '@ts/components/Input';
import '@ts/global-styles';
import GithubAction from '@ts/base-components/Github-Action';
import Socket from '@ts/lib/Socket';
import { extractHost, extractPort, extractNonce } from '@ts/lib/utils/extract-args';

class Application extends React.PureComponent<{},{}> {
  componentDidMount() {
    Socket.connect(
      extractHost(), 
      extractPort(),
      extractNonce()
    );
  }
  render() {
    return (
      <div className={styles.appWrapper}>
        <Page>
          <Box 
            widthBounds={[600, 700]}
            shadowColor="rgba(0, 0, 0, 0.05)"
            borderColor="rgba(208, 208, 208)"
          >
            <Input />
            <TypeOptions />
          </Box>
        </Page>      
        <GithubAction className={styles.forkme} label="Fork Me!" />
      </div>
    );
  }
}

export default Application;