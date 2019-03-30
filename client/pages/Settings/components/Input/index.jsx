/* @flow */
import * as React from 'react';
import BlognameContainer from '@client/containers/Blogname';
import { extractSelectedTypes } from '@client/library/utils/common';
import connect from '@client/library/utils/connect/';
import TypesContainer from '@client/containers/Types';
import type { 
  OptionT
} from '@client/containers/Types/types';
import DisplayContainer from '@client/containers/Display';
import LoopContainer from '@client/containers/Loop';
import type { 
  SetStatusT
} from '@client/containers/Loop/types';
import * as loopStatuses from '@client/containers/Loop/status';
import  type { ToggleT } from '@client/containers/Display/types';
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
import socket from '@client/library/Socket';
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
  errorMessage: ?string,
  togglePage: ToggleT,
  setLoopStatus: SetStatusT,
  typeOptions: Array<OptionT>
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

  onChange = async (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
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
    await this.props.setLoopStatus(loopStatuses.prerun);
    await this.props.togglePage();
    const { value } = this.state;
    const { typeOptions } = this.props;
    const selectedTypes = extractSelectedTypes(typeOptions);
    const didWork = await socket.start(value, selectedTypes);
    if (didWork) {
      await this.props.setLoopStatus(loopStatuses.running);
    }
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

  onKeyUp = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLInputElement) {
      if (event.key !== 'Enter') {
        this.stopTypingDebounced();
      }
    }
  }

  render() {
    const { 
      onChange,
      onKeyDown,
      onKeyUp
    } = this;
    const { value } = this.state;
    return (
      <div>
        { this.renderIcon() }
        <input
          type="text"
          placeholder={ui.labels.placeholders.input}
          onKeyUp={onKeyUp}
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


const selector = (
  blognameContainer,
  typesContainer,
  displayContainer,
  loopContainer
) => ({
  startTyping: blognameContainer.typing,
  stopTyping: blognameContainer.stopTyping,
  isTyping: blognameContainer.state.isTyping,
  inputStatus: blognameContainer.state.status,
  validate: blognameContainer.validate,
  hasTextError: blognameContainer.state.status === blognameInputError,
  hasSelectedTypes: typesContainer.state.options.findIndex(
    (option) => option.value
  ) !== -1,
  typeOptions:typesContainer.state.options,
  togglePage: displayContainer.toggle,
  errorMessage: blognameContainer.state.errorMessage,
  setLoopStatus: loopContainer.setStatus,
});

export default connect<{}, Props, _>(
  [BlognameContainer, TypesContainer, DisplayContainer, LoopContainer],
  selector,
  Input
);