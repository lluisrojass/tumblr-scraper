import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import styles from './Option.css';
import Slider from 'components/Slider';

const Option = (props) => (
    <div className={classnames(styles.wrapper)}>
            <p className={classnames(styles.text)}>
                {capitalize(props.name)}
            </p>
        <Slider 
            isChecked={props.isChecked} 
            onChange={props.onChange} 
        />
    </div> 
);

Option.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired
};

export default Option;