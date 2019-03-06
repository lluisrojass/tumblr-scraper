/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import { Subscribe } from 'unstated'; 
import BlognameContainer from '@ts/containers/Blogname';
import WithActions from '@ts/components/Input-Action-Icons';
import styles from './index.css';
import {
  type ValidatorT,
  type TypingT,
  type StopTypingT
} from '@ts/containers/Blogname/types.flow.js';
import { debounce } from 'debounce';
import config from '@ts/config';

type Props = {
  validate: ValidatorT,
  startTyping: TypingT,
  stopTyping: StopTypingT,
};

type State = {
  value: string
}

class Input extends React.PureComponent<Props, State> {
    state = {
      value: ''
    }; 

    onChange = async (event) => {
      if (event.target instanceof window.HTMLInputElement) {
        const { validate, startTyping } = this.props;
        const value = event.target.value;
        this.setState({ value });
        await startTyping();
        await validate(value);
      }
    };

    stopTypingMS = 300;

    stopTypingDebounced = debounce(
      this.props.stopTyping, 
      this.stopTypingMS
    );

    render() {
      const { 
        onChange, 
        stopTypingDebounced 
      } = this;
      const { value } = this.state;
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
              value={value}
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
        validate={blognameContainer.validate}
        startTyping={blognameContainer.typing}
        stopTyping={blognameContainer.stopTyping}
      />
    ) }
  </Subscribe>
);