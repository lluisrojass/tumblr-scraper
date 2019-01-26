import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lib/utils';

const Input = (props) => (
    <input
        type={ props.type }
        onChange={ props.onChange }
        className={ classnames(props.className) }
        name={ props.name }
        value={ props.value }
    />
);

Input.propTypes = {
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

Input.defaultProps = {
    type: 'text',
    value: '',
    onChange: noop
};

export default Input;