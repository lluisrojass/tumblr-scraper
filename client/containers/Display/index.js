/* @flow */
import { Container } from 'unstated';
import { 
  type StateT,
  type ToggleT
} from './types';
import { 
  settings, 
  results 
} from './pages';

class DisplayContainer extends Container<StateT> {
  state = {
    viewingPage: settings
  };

  toggle: ToggleT = async () => {
    await this.setState((prevState) => ({
      viewingPage: prevState.viewingPage === settings ? 
        results 
        : 
        settings
    }));
  };
}

export default DisplayContainer;