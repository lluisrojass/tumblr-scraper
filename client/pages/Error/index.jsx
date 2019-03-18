/* @flow */
import * as React from 'react';
import log from 'electron-log';
import PageWrapper from '@client/library/components/SP-Wrapper';
import PageBox from '@client/library/components/SP-Content-Box';
import GithubAction from '@client/library/components/Github-Action';
import ui from '@client/ui';
import ghIconStyle from './gh-action.css';
import pageStyles from './sp-styles.css';
import styles from './index.css';

type State = {
  hasError: boolean,
  message: string
};

type Props = {
  children: React.Node
};

class ErrorBoundry extends React.PureComponent<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error) {
    log.error(error);
  }
  
  state = {
    hasError: false,
    message: ''
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (!hasError) {
      return children;
    }

    const { message } = this.state;
    const {
      title, message: errorIntro
    } = ui.labels.errors.fatal;
    return (
      <PageWrapper className={pageStyles.wrapper}>
        <PageBox className={pageStyles.box}>
          <h1 className={styles.title}>
            { title }
          </h1>
          <p className={styles.message}>
            { errorIntro }
            { ` Error: ${message}`}
          </p>
          <div className={ghIconStyle.wrapper}>
            <GithubAction 
              className={ghIconStyle.action} 
              label={ui.labels.github.issue}
              path={ui.external.github.paths.issue}
            />
          </div>
        </PageBox>
      </PageWrapper>
    );
  }
}

export default ErrorBoundry;