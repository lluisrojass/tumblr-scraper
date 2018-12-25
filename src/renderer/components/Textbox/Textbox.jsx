import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Textbox.css';
import BlognameState from 'containers/Blogname';
import { Subscribe } from 'unstated';

class TextboxComponent extends React.PureComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    onChange = (e) => {
        e.preventDefault();
        this.props.onChange(e.target.value);
    }

    render() {

        const { name, value } = this.props;
        
        return (
            <div className={classnames(styles.wrapper)}>
                <input 
                    type="text"
                    name={name}
                    value={value}
                    onChange={this.onChange}
                    className={classnames(styles.input)}
                />
                <div className={classnames(styles.addon)}>
                    <span>{ '.tumblr.com' }</span>
                </div>
            </div>
        );
    }
}

const Textbox = () => (
    <Subscribe to={[ BlognameState ]}>
        { (blognameState) => (
            <TextboxComponent onChange={ blognameState.setBlogname } value={ blognameState.blogname } />
        ) }
    </Subscribe>
);

export { Textbox }; 