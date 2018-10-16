'use strict';

import pathOr from 'lodash/fp/pathOr';

const exactMatch = function(regex, str) {
    const match = str.match(regex);
    return match != null && str == match[0];
};

const withPreventDefault = function(cb) {
    return (e) => {
        const exists = pathOr(false, 'preventDefault', e);
        if (typeof exists === 'function') {
            e.withPreventDefault();
        }

        cb();
    };
};   


export { exactMatch, withPreventDefault };