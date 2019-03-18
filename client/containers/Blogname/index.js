/* @flow */
import { 
  Container,
} from 'unstated';
import { 
  exactMatch 
} from '@client/library/utils/common';
import * as statuses from './input-status';
import type {
  StateT,
  ValidatorT,
  ResetterT,
  TypingT,
  StopTypingT
} from './types';
import ui from '@client/ui';

class BlognameContainer extends Container<StateT> {
    state = {
      _blogname: '',
      status: statuses.empty,
      errorMessage: null,
      isTyping: false
    };

    validate: ValidatorT = async (text) => {
      if (text.length === 0) {
        await this.setState({
          _blogname: '',
          status: statuses.empty,
          errorMessage: null
        });
        return;
      }
      else if (text.length > 32) {
        await this.setState({
          _blogname: text,
          status: statuses.error,
          errorMessage: ui.labels.errors.blogname.toolong
        });
        return;
      }
      else if (!exactMatch(/^[a-zA-Z0-9]+(?:-*[a-zA-Z0-9])*$/, text)) {
        await this.setState({
          _blogname: text,
          status: statuses.error,
          errorMessage: ui.labels.errors.blogname.invalid
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
        status: statuses.empty,
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