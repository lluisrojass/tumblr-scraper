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

class Slider extends React.PureComponent<Props> {
  render() {
    const { options } = this.props;
    const shouldSlide: boolean = options.length > 0 && !options[0].value;
    return (
      <div className={styles.wrapper}>
        <div className={styles.sliderTrack}>
          { 
            options.map((option, i) => (
              <div 
                className={classnames(
                  styles.sliderOption,
                  option.value && styles.selected
                )}
                onClick={decorateWithIndex(this.props.set, i)}
                key={i}
              >
                { option.label }
              </div>)) 
          }
          <div className={
            classnames(
              styles.highlighterContainer,
              shouldSlide && styles.slid
            )}>
            <div className={styles.highlighter}></div>
          </div>
        </div>
      </div>
    );
  }
}

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
