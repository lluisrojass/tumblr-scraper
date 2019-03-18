/* @flow */
import type { 
  noopT
} from '@client/library/utils/types';

export const exactMatch = (pattern: RegExp, str: string): boolean => {
  const match: ?RegExp$matchResult = str.match(pattern);
  if (match) {
    const m: ?string = match[0];
    return str === m;
  }
  return false;
};

export const noop: noopT = () => {};