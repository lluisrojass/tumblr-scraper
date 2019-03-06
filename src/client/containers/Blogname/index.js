/* @flow */
import { 
  Container,
} from 'unstated';
import { exactMatch } from '@ts/lib/utils/common';
import * as statuses from './constants';
import {
  type StateT,
  type SetterT,
  type ResetterT,
  type TypingT,
  type StopTypingT
} from './types.flow.js';

class BlognameContainer extends Container {
    state: StateT = {
      blogname: '',
      status: statuses.clear,
      errorMessage: null,
      isTyping: false
    };

    set: SetterT = async (text) => {
      if (text.length === 0) {
        await this.setState({
          blogname: '',
          status: statuses.clear,
          errorMessage: null
        });
        return;
      }
      else if (text.length > 32) {
        await this.setState({
          blogname: text,
          status: statuses.error,
          errorMessage: 'custom blog names must be 32 characters or less'
        });
        return;
      }
      else if (!exactMatch(/^[a-zA-Z0-9]+(?:-*[a-zA-Z0-9])*$/, text)) {
        await this.setState({
          blogname: text,
          status: statuses.error,
          errorMessage: 'invalid blog name'
        });
        return;
      }

      await this.setState({ 
        blogname: text,
        status: statuses.good,
        errorMessage: null
      });
    };

    reset: ResetterT = async () => {
      await this.setState({ 
        blogname: '',
        status: statuses.clear,
        errorMessage: null
      });
    };

    typing: TypingT = async () => {
      if (!this.state.isTyping) {
        await this.setState({
          isTyping: true
        });
      }
    };

    stopTyping: StopTypingT = async () => {
      await this.setState({
        isTyping: false
      });
    };
}

export default BlognameContainer;