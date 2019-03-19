/* @flow  */
import * as React from 'react';
import { Container } from 'unstated';
import * as statuses from './status';
import type {
  StateT,
  SetStatusT
} from './types';

class LoopContainer extends Container<StateT> {
  state = {
    status: statuses.stopped
  };

  setStatus: SetStatusT = async (status) => {
    await this.setState({
      status
    });
  };
}

export default LoopContainer;