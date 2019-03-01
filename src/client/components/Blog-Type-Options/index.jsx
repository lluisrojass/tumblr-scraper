/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import classnames from 'classnames';
import styles from './index.css';
import OptionsContainer from '@ts/containers/Blog-Type-Options';
import { 
  type OptionT,
  type SetterT
} from '@ts/containers/Blog-Type-Options/types.flow.js';

type IndexDecorator = (SetterT, number) => () => Promise<void>;

const decorateWithIndex: IndexDecorator = (func, index) => {
  return () => {
    return func(index);
  };
};

type Props = {
    options: Array<OptionT>,
    set: SetterT
}

const Slider = (props: Props) => {
  const shouldSlide = !props.options[0].value;
  return (
    <div className={styles.sliderTrack}>
      {
        props.options.map((option, i) => (
          <div 
            className={classnames(
              styles.sliderOption,
              option.value && styles.selected
            )}
            onClick={decorateWithIndex(props.set, i)}
            key={i}
          >
            { option.label }
          </div>
        ))
      }
      <div className={
        classnames(
          styles.highlighterContainer,
          shouldSlide && styles.slid
        )}>
        <div className={styles.highlighter}></div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <Subscribe to={[OptionsContainer]}>
      { (optionsContainer) => (
        <Slider
          options={optionsContainer.state.options}
          set={optionsContainer.set}
        />
      ) }
    </Subscribe>
  );
};
