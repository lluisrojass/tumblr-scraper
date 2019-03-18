/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import BlognameContainer from '@client/containers/Blogname';
import TypesContainer from '@client/containers/Types';
import DisplayContainer from '@client/containers/Display';
import { type ToggleT } from '@client/containers/Display/types';
import type {
  ValidatorT,
  TypingT,
  StopTypingT,
  InputStatusT
} from '@client/containers/Blogname/types';
import ArrowIcon from '@client/library/icons/go.svg';
import XIcon from '@client/library/icons/close.svg';
import RippleLoader from '@client/library/components/Ripple-Loader';
import { debounce } from 'debounce';
import { error as blognameInputError } from '@client/containers/Blogname/input-status';
import ui from '@client/ui';
import classnames from 'classnames';
import actionStyles from './actions.css';
import styles from './index.css';

type Props = {
  startTyping: TypingT,
  stopTyping: StopTypingT,
  isTyping: boolean,
  inputStatus: InputStatusT,
  validate: ValidatorT,
  hasSelectedTypes: boolean,
  hasTextError: boolean,
  errorMessage: string,
  togglePage: ToggleT
};

type State = {
  value: string
}

class Input extends React.PureComponent<Props, State> {
  state = {
    value: ''
  }; 

  stopTypingMS = 200;

  stopTypingDebounced = debounce(
    this.props.stopTyping, 
    this.stopTypingMS
  );

  onChange = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const { validate, startTyping } = this.props;
      const value = event.target.value;
      this.setState({ value });
      await startTyping();
      await validate(value);
    }
  };

  renderIcon = () => {
    const { props } = this;
    const { value } = this.state;
    const shouldShowLoader = props.isTyping;
    const hasError = props.hasTextError || !props.hasSelectedTypes;
    const shouldShowError = !shouldShowLoader && hasError;
    const shouldShowGo = !shouldShowError && !shouldShowLoader;
    const shouldBeAllowedToGo = shouldShowGo && !hasError && !!value;

    return (
      <>
        <div className={classnames(
          actionStyles.rippleWrapper,
          shouldShowLoader && actionStyles.visible
        )}>
          <RippleLoader className={styles.ripple} />
        </div>
        <XIcon className={classnames(
          actionStyles.xIcon,
          shouldShowError && actionStyles.visible
        )} />
        <ArrowIcon className={classnames(
          actionStyles.arrowIcon,
          shouldShowGo && actionStyles.visible,
          shouldBeAllowedToGo && actionStyles.withColor
        )} />
      </>
    );
  };

  start = async () => {
    await this.props.togglePage();
  }

  onKeyDown = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (event.target instanceof HTMLInputElement) {
      if (key !== 'Enter') return;
      const { 
        isTyping, 
        hasTextError, 
        hasSelectedTypes
      } = this.props;
      const { value } = this.state;
      if (!isTyping && !hasTextError && hasSelectedTypes && !!value) {
        event.target.blur();
        this.start();
      }
    }
  };

  render() {
    const { 
      onChange,
      onKeyDown,
      stopTypingDebounced
    } = this;
    const { value } = this.state;
    return (
      <div>
        { this.renderIcon() }
        <input
          type="text"
          placeholder={ui.labels.placeholders.input}
          onKeyUp={stopTypingDebounced}
          onKeyDown={onKeyDown}
          onChange={onChange}
          className={classnames(styles.input)}
          name="blogname"
          value={value}
        />
      </div>
    );
  }
}

export default () => (
  <Subscribe to={[BlognameContainer, TypesContainer, DisplayContainer]}>
    { (blognameContainer, typesContainer, displayContainer) => (
      <Input
        startTyping={blognameContainer.typing}
        stopTyping={blognameContainer.stopTyping}
        isTyping={blognameContainer.state.isTyping}
        inputStatus={blognameContainer.state.status}
        validate={blognameContainer.validate}
        hasTextError={blognameContainer.state.status === blognameInputError}
        hasSelectedTypes={typesContainer.state.options.findIndex(
          (option) => option.value
        ) !== -1}
        togglePage={displayContainer.toggle}
        errorMessage={blognameContainer.state.errorMessage}
      />
    ) }
  </Subscribe>
);