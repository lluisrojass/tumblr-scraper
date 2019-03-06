/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import { noop } from '@ts/lib/utils/common';
import styles from './index.css';

type Props = {
    name: string,
    isChecked: boolean,
    capitalize: ?boolean,
    value: string,
    onClick: (number) => Promise<void>
}

type State = {
  pressed: boolean
}

class Option extends React.PureComponent<Props, State> {
  state = {
    pressed: false
  };

  onMouseDown = () => {
    this.setState({
      pressed: true
    });
  }

  onMouseUp = () => {
    this.setState({
      pressed: false
    });
  }

  render() {
    const {
      props,
      onMouseDown,
      onMouseUp,
      state
    } = this;
    const {
      isChecked
    } = this.props;
    return (
      <div className={styles.container}>
        <input
          type="checkbox"
          className={styles.checkbox}
          tabIndex={-1}
          checked={isChecked}
          onChange={noop}
        />
        <span 
          onClick={props.onClick}
          tabIndex={0} 
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          className={classnames(
            props.capitalize && styles.cap,
            state.pressed && styles.pressed,
            styles.label
          )}>
          { props.name }
        </span>
      </div>
    );
  }
}

export default Option;