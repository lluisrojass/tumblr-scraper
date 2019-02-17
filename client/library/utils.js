/* eslint-disable react/display-name */
import React from 'react';
import { Subscribe } from 'unstated';

const isObject = (p) => toString.call(p) === toString.call({});

const exactMatch = (pattern, str) => {
    const match = str.match(pattern);
    return match != null && str == match[0];
};

const withPreventDefault = (cb) => 
    (e) => {
        if (isObject(e) && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        cb(e);
    };

const formatLabel = (label, args) => {
    if (Array.isArray(args)) {
        let formattedLabel = args.reduce((agg, arg, index) => agg.replace(`{${index}}`, arg), label);
        return formattedLabel;
    }
    else if (typeof args === 'string') {
        return label.replace('{0}', args);
    }

    return label;
};

const withSubscribe = (Containers, Component) => props => {
    return (
        <Subscribe to={Containers.map(c => c.container)}>
            { function() {
                const stateProps = {};
                arguments.forEach((arg, i) => (stateProps[Containers[i]] = arg));
                return (
                    <Component
                        {...stateProps}
                        {...props}
                    />
                );
            } }
        </Subscribe>
    );
};

const noop = () => {};

export {
    noop,
    isObject,
    withSubscribe,
    formatLabel,
    withPreventDefault,
    exactMatch
};