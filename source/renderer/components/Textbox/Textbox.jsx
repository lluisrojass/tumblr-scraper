import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import pathOr from 'lodash/fp/pathOr';
import styles from './Textbox.less';

class Textbox extends React.PureComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    onChange(e) {
        e.preventDefault();
        this.props.onChange(e.target.value);
    }

    render() {
        const name = pathOr(null, 'name', this.props); 
        const blogname = pathOr(null, 'blogname', this.props);
        
        return (
            <div className={classnames(styles.wrapper)}>
                <p>{name}</p>
                <input 
                    type="text"
                    name={name}
                    value={blogname}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export { Textbox };