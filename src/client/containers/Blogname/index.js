/* @flow */
import { 
  Container,
} from 'unstated';
import { exactMatch } from '@ts/lib/utils/common';
import * as statuses from './constants';
import {
  type StateT,
  type ValidatorT,
  type ResetterT,
  type TypingT,
  type StopTypingT
} from './types.flow.js';

class BlognameContainer extends Container {
    state: StateT = {
      _blogname: '',
      status: statuses.clear,
      errorMessage: null,
      isTyping: false
    };

    validate: ValidatorT = async (text) => {
      if (text.length === 0) {
        await this.setState({
          _blogname: '',
          status: statuses.clear,
          errorMessage: null
        });
        return;
      }
      else if (text.length > 32) {
        await this.setState({
          _blogname: text,
          status: statuses.error,
          errorMessage: 'custom blog names must be 32 characters or less'
        });
        return;
      }
      else if (!exactMatch(/^[a-zA-Z0-9]+(?:-*[a-zA-Z0-9])*$/, text)) {
        await this.setState({
          _blogname: text,
          status: statuses.error,
          errorMessage: 'invalid blog name'
        });
        return;
      }

      await this.setState({ 
        _blogname: text,
        status: statuses.good,
        errorMessage: null
      });
    };

    reset: ResetterT = async () => {
      await this.setState({ 
        _blogname: '',
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