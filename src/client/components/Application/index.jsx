/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import styles from './index.css';
import SocketContainer from '@ts/containers/Socket';
import Page from '@ts/base-components/Page';
import Box from '@ts/base-components/Box';
import TypeOptions from '@ts/components/Type-Options';
import Input from '@ts/components/Input';
import StartupLoader from '@ts/components/Startup-Loader';
import '@ts/global-styles';
import GithubAction from '@ts/base-components/Github-Action';
import Socket from '@ts/lib/Socket';
import {
  type socketStates
} from '@ts/containers/Socket/index.types';
import * as socketConnStates from '@ts/containers/Socket/conn-states';
import { extractHost, extractPort, extractNonce } from '@ts/lib/utils/extract-args';
import config from '@ts/config';

type Props = {
  socketConnState: socketStates
}

class Application extends React.PureComponent<Props,{}> {
  componentDidMount() {
    Socket.connect(extractHost(), extractPort(), extractNonce());
  }

  render() {
    const { socketConnState } = this.props;
    const renderLoader = 
      socketConnState === socketConnStates.startup;
    return (
      <div className={styles.appWrapper}>
        {
          renderLoader ? 
            <StartupLoader />
            :
            <>
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
              <GithubAction 
                className={styles.forkme}
                label={config.labels.github.fork}
                path={config.external.github.paths.fork}
              />
            </>
        }
      </div>
    );
  }
}

export default () => (
  <Subscribe to={[SocketContainer]}>
    {
      (socketContainer) => (
        <Application 
          socketConnState={socketContainer.state.status}
        />
      )
    }
  </Subscribe>
);