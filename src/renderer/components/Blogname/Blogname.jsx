import React from 'react';
import PropTypes from 'prop-types';
import { Subscribe } from 'unstated';
import BlognameState from 'state/Blogname';
import Textbox from '../Textbox/';

class BlognameComponent extends React.PureComponent {

    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    render() {
        const { value, onChange } = this.props;
        return (
            <Textbox
                name={'blogname'}
                blogname={value}
                onChange={onChange}
            />
        );
    }

}

const Blogname = () => (
    <Subscribe to={[ BlognameState ]}>
        {(blognameState) => (
            <BlognameComponent
                value={blognameState.state.blogname}
                onChange={blognameState.setBlogname}
            />
        )}
    </Subscribe>
);

export { Blogname };