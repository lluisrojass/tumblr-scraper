import React from 'react';
import noop from 'lodash/noop';
import Button from 'components/Button';
import classnames from 'classnames';
import { setDisplayName } from 'recompose';

function factory(options) {
    const onClick = options.onClick || noop;
    const cName = options.className || false;
    const label = options.label || '';
    const name = options.name || false;

    let btn = class B extends React.Component {
        render() {
            return (
                <Button classname={classnames(cName)} onClick={onClick}>
                    { label }
                </Button>
            );
        }
    }; 

    if (name) {
        btn = setDisplayName(name, btn);
    }

    return btn;
}

export default factory;