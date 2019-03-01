/* @flow */
import { 
  Container
} from 'unstated';
import { 
  type OptionT, 
  type StateT,
  type OptionsToggleT 
} from './types.flow.js';
import { labels } from '@ts/config';
import { tumblrTypes } from '@ts/type-map';
import { makeOption } from '@ts/lib/utils/options';

const resetOptions = (): Array<OptionT> => ([
  makeOption(labels.options.all, tumblrTypes.all, true),
  makeOption(labels.options.photo, tumblrTypes.photo, false),
  makeOption(labels.options.text, tumblrTypes.text, false),
  makeOption(labels.options.ask, tumblrTypes.ask, false),
  makeOption(labels.options.chat, tumblrTypes.chat, false),
  makeOption(labels.options.video, tumblrTypes.video, false),
]);

class TypeOptionsContainer extends Container {
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
              makeOption(labels.options.all, tumblrTypes.all, false),
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