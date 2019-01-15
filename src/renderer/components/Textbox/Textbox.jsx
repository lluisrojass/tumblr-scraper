import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/InputBase/';
import BlognameState from 'containers/Blogname';
import styles from './Textbox.css';
import { withPreventDefault, withSubscribe } from 'rlib/utils';

const BLOGNAME_STATE = 'blognameState';

const Addon = () => (
    <div className={classnames(styles.addon)}>
        <span>.tumblr.com</span>
    </div>
);

const Textbox = (props) => (
    <div className={classnames(styles.wrapper)}>
        <Input
            type='text'
            name='blogname'
            className={classnames(styles.input)}
            value={props[BLOGNAME_STATE].state.blogname}
            onChange={withPreventDefault((e) => props[BLOGNAME_STATE].setBlogname(e.target.value))}
        />
        <Addon />
    </div>
);

Textbox.propTypes = {
    [BLOGNAME_STATE]: PropTypes.obj
}

export default withSubscribe([
    {
        name: BLOGNAME_STATE,
        container: BlognameState
    }
], Textbox);