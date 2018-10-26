import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Options.css';
import Option from '../Option/';
import { Subscribe } from 'unstated';
import SlidersState from 'state/Sliders';

class OptionsComponent extends React.PureComponent {

    static propTypes = {
        sliders: PropTypes.array.isRequired,
        toggleSlider: PropTypes.func.isRequired
    };

    static defaultProps = {
        sliders: []
    }

    toggle = index => () => this.props.toggleSlider(index);

    render() {
        const { sliders } = this.props;
        return (
            <div className={classnames(styles.wrapper)}>
                {sliders.map((slider, index) => (
                    <Option
                        key={index}
                        name={slider.name}
                        isChecked={slider.value}
                        onChange={this.toggle(index)}
                    />
                ))}
            </div>
        );
    }
}

const Options = () => (
    <Subscribe to={[ SlidersState ]}>
        {(slidersState) => (
            <OptionsComponent 
                toggleSlider={slidersState.toggleSlider}
                sliders={slidersState.state.sliders}
            />
        )}
    </Subscribe>
);

export { Options };