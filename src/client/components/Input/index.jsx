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
  type StopTypingT,
  type StatusT
} from '@ts/containers/Blogname/types.flow.js';
import { debounce } from 'debounce';
import config from '@ts/config';
import * as statuses from '@ts/containers/Blogname/constants';

type Props = {
  validate: ValidatorT,
  startTyping: TypingT,
  stopTyping: StopTypingT,
  errorMessage: string,
  status: StatusT,
  isTyping: boolean
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

    getErrorBallonOptions = () => {
      const {
        status,
        isTyping,
        errorMessage
      } = this.props;
      if (!isTyping && status === statuses.error) {
        return {
          'data-balloon-pos': 'up',
          'data-balloon': `psst... ${errorMessage}`,
          'data-balloon-visible': true
        };
      }

      return {};
    }

    render() {
      const { 
        onChange, 
        stopTypingDebounced,
        getErrorBallonOptions
      } = this;
      const { value } = this.state;
      const balloonOptions = getErrorBallonOptions();
      return (
        <WithActions>
          <div {...balloonOptions} className={styles.inputWrapper}>
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
        isTyping={blognameContainer.state.isTyping}
        status={blognameContainer.state.status}
        errorMessage={blognameContainer.state.errorMessage}
      />
    ) }
  </Subscribe>
);