/* @flow */
import type { 
  noopT
} from '@client/library/utils/types';
import type {
  OptionT
} from '@client/containers/Types/types';
import types from 'tumblr-type-map';

export const exactMatch = (pattern: RegExp, str: string): boolean => {
  const match: ?RegExp$matchResult = str.match(pattern);
  if (match) {
    const m: ?string = match[0];
    return str === m;
  }
  return false;
};

export const extractSelectedTypes = (options: Array<OptionT>): Array<string> => {
  const allOption = options.find(o => o.type === types.all);
  if (!allOption) {
    throw new Error('Unknown Error');
  }
  if (allOption.value) {
    return options.filter(o => o.type !== types.all).map(o => o.type);
  }

  return options.filter(o => o.value && o.type !== types.all).map(o => o.type);
}

export const noop: noopT = () => {};