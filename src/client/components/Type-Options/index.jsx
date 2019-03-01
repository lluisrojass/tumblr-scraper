/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import styles from './index.css';
import Option from '@ts/components/Option/';
import OptionsContainer from '@ts/containers/Type-Options';
import { 
  type StateT, 
  type OptionsToggleT 
} from '@ts/containers/Type-Options/types.flow.js';

type IndexDecorator = (OptionsToggleT, number) => () => Promise<void>;

const decorateWithIndex: IndexDecorator = (func, index) => {
  return () => {
    return func(index);
  };
};

type Props = {
    optionsContainer: {
      state: StateT,
      toggle: OptionsToggleT
    }
}

const Options = (props: Props) => {
  const containerState = props.optionsContainer.state;
  return (
    <div className={styles.wrapper}>
      { containerState.options.map((option, index) => (
        <Option 
          key={index}
          name={option.label}
          isChecked={option.value}
          value={option.type}
          capitalize={true}
          onClick={decorateWithIndex(
            props.optionsContainer.toggle,
            index
          )}
        />
      )) }
    </div>
  );
};

export default () => {
  return (
    <Subscribe to={[OptionsContainer]}>
      { (optionsContainer) => (
        <Options
          optionsContainer={optionsContainer}
        />
      ) }
    </Subscribe>
  );
};
