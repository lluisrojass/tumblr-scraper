import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Textbox.less';
import BlognameState from 'state/Blogname';
import { Subscribe } from 'unstated';

class TextboxComponent extends React.PureComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired
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