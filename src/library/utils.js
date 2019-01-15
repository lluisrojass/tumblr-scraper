const noop = () => {};

const isObject = ( p ) => toString.call(p) === toString.call({});

export {
    noop,
    isObject
}