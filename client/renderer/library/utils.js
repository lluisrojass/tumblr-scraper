import { Subscribe } from 'unstated';
import { isObject } from 'lib/utils';
/**
 * Check if a RegExp pattern fully matches a given string.
 * @param {RegExp} pattern - regex to utilize
 * @param {String} str - string to match
 * @returns {Boolean} isExactMatch
 */
const exactMatch = (pattern, str) => {
    const match = str.match(pattern);
    return match != null && str == match[0];
};
/**
 * HOF to handle preventDefault-ing an event and then pass
 * off the event to be handled. 
 * @param {Function} cb - callback, gets invoked with the recieved event 
 */
const withPreventDefault = (cb) => 
    (e) => {
        if (isObject(e) && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        cb(e);
    };

/**
 * Replaces a String's placeholders with corresponding arguments. 
 * @param {String} label - Raw label to be decorated.
 * @param {*[]|String} args - Values to be slotted into the string. 
 * @returns {String} Decorated label.
 */
const formatLabel = (label, args) => {
    if (Array.isArray(args)) {
        let formattedLabel = args.reduce((agg, arg, index) => agg.replace(`{${index}}`, arg), label);
        return formattedLabel;
    }
    else if (typeof args === 'string') {
        return label.replace('{0}', args);
    }

    return label;
}
/**
 * HOC to hook a component to unstated state containers. 
 * @param {Object[]} containers - Contains all containers to be subbed. 
 *                                Each item must contain a 'name' and 'container' property.
 * @param {ReactComponent} Component - JSX Component to be decorated with state as props
 */
const withSubscribe = (containers, Component) => (props) =>  (
    <Subscribe to={containers.map(c => c.container)}>
    { function() {
        const stateProps = {};
        arguments.forEach((arg, i) => (stateProps[containers[i]] = arg));
        return (
            <Component
                {...stateProps}
                {...props}
            />
        );
    } }
    </Subscribe>
);


export { 
    exactMatch, 
    withPreventDefault, 
    formatLabel,
    withSubscribe
};