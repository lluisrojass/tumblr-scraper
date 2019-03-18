/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import SocketContainer from '@client/containers/Socket';
import Socket from '@client/library/Socket';
import { startup as startupStatus } from '@client/containers/Socket/conn-status';
import SettingsPage from '@client/pages/Settings/';
import ResultsPage from '@client/pages/Results';
import StartupLoader from '@client/pages/Loader';
import { 
  extractHost, 
  extractPort, 
  extractNonce 
} from '@client/library/utils/extract-args';
import styles from './index.css';

type Props = {
  renderLoader: boolean
}

class Application extends React.PureComponent<Props,{}> {
  componentDidMount() {
    Socket.connect(
      extractHost(), 
      extractPort(), 
      extractNonce()
    );
  }

  render() {
    const { renderLoader } = this.props;
    return (
      <div className={styles.appWrapper}>
        {
          renderLoader ? 
            <StartupLoader />
            :
            <>
              <SettingsPage /> 
              <ResultsPage /> 
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
          renderLoader={socketContainer.state.status === startupStatus}
        />
      )
    }
  </Subscribe>
);