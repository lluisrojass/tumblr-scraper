/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import { Subscribe } from 'unstated'; 
import BlognameContainer from '@ts/containers/Blogname';
import WithActions from '@ts/components/Input-Actions';
import styles from './index.css';
import { 
  type StateT, 
  type SetterT,
  type TypingT,
  type StopTypingT
} from '@ts/containers/Blogname/types.flow.js';
import { debounce } from 'debounce';
import config from '@ts/config';

type Props = {
  blognameState: StateT,
  setBlogname: SetterT,
  startTyping: TypingT,
  stopTyping: StopTypingT,
}

class Input extends React.PureComponent<Props> {
    onChange = async (event) => {
      if (event.target instanceof window.HTMLInputElement) {
        const { setBlogname, startTyping } = this.props;
        const { value } = event.target;
        await startTyping();
        await setBlogname(value);
      }
    };

    stopTypingMS = 300;

    stopTypingDebounced = debounce(
      this.props.stopTyping, 
      this.stopTypingMS
    );

    render() {
      const { 
        blognameState
      } = this.props;
      const { 
        onChange, 
        stopTypingDebounced 
      } = this;
      return (
        <WithActions>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder={config.labels.placeholders.input}
              onKeyUp={stopTypingDebounced}
              onChange={onChange}
              className={classnames(styles.input)}
              name="blogname"
              value={blognameState.blogname}
            />
          </div>
        </WithActions>
      );
    }
}

export default () => (
  <Subscribe to={[BlognameContainer]}>
    { (blognameContainer) => (
      <Input 
        blognameState={blognameContainer.state}
        setBlogname={blognameContainer.set}
        startTyping={blognameContainer.typing}
        stopTyping={blognameContainer.stopTyping}
      />
    ) }
  </Subscribe>
);