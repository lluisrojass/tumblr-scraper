/* @flow */
import * as T from '@ts/lib/utils/types.flow.js';

export const isObject = (p: any): boolean => 
  toString.call(p) === toString.call({});

export const withPreventDefault = 
  (callback: T.GenericEventHandlerT): T.GenericEventHandlerT => {
    return (event) => {
      if (isObject(event) && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      callback(event);
    };
  };

export const exactMatch = (pattern: RegExp, str: string): boolean => {
  const match: ?Object = str.match(pattern);
  if (typeof match == 'object' && match != null) {
    return str === match[0];
  }
  return false;
};

export const noop: T.noopT = () => {};