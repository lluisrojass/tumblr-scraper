/* @flow */
import { 
  Container, 
  type ContainerType 
} from 'unstated';
import { 
  type OptionT, 
  type StateT,
  type OptionsToggleT 
} from './types.flow.js';
import { labels } from '@ts/config';
import typeMap from '@ts/type-map';

const makeOption = (label: string, type: string, value: boolean): 
    OptionT => ({ label, type, value });

const resetOptions = (): Array<OptionT> => ([
  makeOption(labels.options.all, typeMap.all, true),
  makeOption(labels.options.photo, typeMap.photo, false),
  makeOption(labels.options.text, typeMap.text, false),
  makeOption(labels.options.ask, typeMap.ask, false),
  makeOption(labels.options.chat, typeMap.chat, false),
  makeOption(labels.options.video, typeMap.video, false),
]);

class TypeOptionsContainer<ContainerType> extends Container {
    state: StateT = {
      options: resetOptions()
    }

    toggle: OptionsToggleT = async (index: number) => {
      if ((this.state.options.length < index) || (index < 0)) {
        return;
      }

      const option = this.state.options[index];
      const allOption = this.state.options.find(s => 
        s.label === labels.options.all);

      if (!allOption) {
        throw new Error('Unknown Error');
      }

      if (option === allOption && !option.value) {
        await this.setState({
          options: resetOptions()
        });
      }
      else {
        /* turn off all option */
        if (allOption.value && !option.value) {
          const allOptionIndex = this.state.options.findIndex(
            s => s === allOption
          );
          await this.setState({
            options: [
              ...this.state.options.slice(0, allOptionIndex),
              makeOption(labels.options.all, typeMap.all, false),
              ...this.state.options.slice(allOptionIndex + 1)
            ]
          });
        } 

        const options = [ 
          ...this.state.options.slice(0, index), 
          makeOption(option.label, option.type, !option.value), 
          ...this.state.options.slice(index + 1)
        ];

        await this.setState({ options });
      }
    };
}

export default TypeOptionsContainer;