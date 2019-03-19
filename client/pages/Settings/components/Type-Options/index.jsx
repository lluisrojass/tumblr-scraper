/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import TypeOption from '@client/pages/Settings/components/Type-Option/';
import TypesContainer from '@client/containers/Types';
import {
  type StateT,
  type OptionsToggleT
} from '@client/containers/Types/types';
import styles from './index.css';

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
    <div className={styles.grey}>
      <div className={styles.wrapper}>
        { containerState.options.map((option, index) => (
          <TypeOption 
            key={index}
            name={option.label}
            isChecked={option.value}
            value={option.type}
            capitalize
            onClick={decorateWithIndex(
              props.optionsContainer.toggle,
              index
            )}
          />
        )) }
      </div>
    </div>
  );
};

export default () => {
  return (
    <Subscribe to={[TypesContainer]}>
      { (typesContainer) => (
        <Options
          optionsContainer={typesContainer}
        />
      ) }
    </Subscribe>
  );
};
