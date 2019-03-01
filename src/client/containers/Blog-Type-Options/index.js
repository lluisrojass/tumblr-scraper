/* @flow */
import { Container } from 'unstated';
import { labels } from '@ts/config';
import { makeOption } from '@ts/lib/utils/options';
import {
  type StateT,
  type SetterT
} from './types.flow.js';
import { domainTypes } from '@ts/type-map';

class BlogTypeOptions extends Container {
  state: StateT = {
    options: [
      makeOption(labels.blogType.internal, domainTypes.internal, true),
      makeOption(labels.blogType.custom, domainTypes.custom, false)
    ]
  };

  set: SetterT = async (index) => {
    const { options } = this.state;
    const updatedOptions = options.map((option, i) => {
      return i === index ?
        makeOption(option.label, option.type, true)
        :
        makeOption(option.label, option.type, false);
    });
    await this.setState({
      options: updatedOptions
    });
  }
}

export default BlogTypeOptions;