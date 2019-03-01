/* @flow */
import { 
  Container,
} from 'unstated';
import { exactMatch } from '@ts/lib/utils/common';
import {
  type StateT,
  type SetterT,
  type ResetterT
} from './types.flow.js';

class BlognameContainer extends Container {
    state: StateT = {
      blogname: '',
      status: 'CLEAR',
      errorMessage: null
    };

    set: SetterT = async (text, blogType) => {
      if (text.length === 0) {
        await this.setState({
          blogname: '',
          status: 'CLEAR',
          errorMessage: null
        });
        return;
      }
      else if (text.length > 32 && blogType === 'is_internal') {
        await this.setState({
          blogname: text,
          status: 'ERROR',
          errorMessage: 'custom blog names must be 32 characters or less'
        });
        return;
      }
      else if (!exactMatch(/^[a-zA-Z0-9]+(?:-*[a-zA-Z0-9])*$/, text)) {
        await this.setState({
          blogname: text,
          status: 'ERROR',
          errorMessage: 'invalid blog name'
        });
        return;
      }

      await this.setState({ 
        blogname: text,
        status: 'GOOD',
        errorMessage: null
      });
    };

    reset: ResetterT = async () => {
      await this.setState({ 
        blogname: '',
        status: 'CLEAR',
        errorMessage: null
      });
    };
}

export default BlognameContainer;