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

function formatLabel(label, args) {
    if (Array.isArray(args)) {
        let formatted = args.reduce((agg, arg, index) => (
            agg.replace(`{${index}}`, arg)
        ), label);
        
        return formatted;
    }
    else if (typeof args === 'string') {
        return label.replace('{0}', args);
    }

    return label;
}

function attachPathToLabel(label, path) {
    return formatLabel(`${label} caught requesting {0}`, path);
}

export { exactMatch, withPreventDefault, formatLabel, attachPathToLabel };