/* @flow */
import * as React from 'react';
import log from 'electron-log';
import FatalError from '@ts/components/Fatal-Error';

type State = {
  hasError: boolean,
  message: string
};

type Props = {
  children: any
}

class Boundry extends React.PureComponent<Props, State> {
  state = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error, info: any) {
    log.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      const { message } = this.state;
      return (
        <FatalError message={message || 'Unknown Error'} />
      );
    }
    else {
      return children; 
    }
  }
}

export default Boundry;