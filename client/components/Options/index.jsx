/* @flow */
import * as React from 'react';
import styles from './index.css';
import Option from '@ts/components/Option/';
import OptionsContainer from '@ts/containers/Options';
import { withSubscribe } from '@ts/utils';

const SLIDERS_STATE_KEY: string = 'optionsContainer';

const decorateWithIndex = (func: (index: number) => void, index: number) => (): void => {
    func(index);
};

type Props = {
    'optionsContainer': {
        state: {
            sliders: Array<{|
                value: any,
                name: string
            |}>
        },
        toggle: () => void
    }
}

const Options = (props: Props): React.Element<'div'> => (
    <div className={styles.wrapper}>
        {
            props[SLIDERS_STATE_KEY].state.sliders.map((slider, index) => (
                <Option
                    key={index}
                    name={slider.label}
                    isChecked={slider.value}
                    value={slider.value}
                    onChange={decorateWithIndex(
                        props[SLIDERS_STATE_KEY].toggle,
                        index
                    )}
                />
            ))
        }
    </div>
);

export default withSubscribe([
    {
        name: SLIDERS_STATE_KEY,
        container: OptionsContainer
    }
], Options);