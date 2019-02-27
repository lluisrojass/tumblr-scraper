/* @flow */
import { 
  Container, 
  type ContainerType 
} from 'unstated';
import {
  type StateT,
  type SetterT,
  type ResetterT
} from './types.flow.js';

class BlognameContainer<ContainerType> extends Container {
    state: StateT = {
      blogname: ''
    };

    set: SetterT = async (text) => {
      await this.setState({ blogname: text });
    };

    reset: ResetterT = async () => {
      await this.setState({ blogname: '' });
    };
}

export default BlognameContainer;