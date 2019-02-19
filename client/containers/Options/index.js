/* @flow */
import { Container, type ContainerType } from 'unstated';
import { labels } from '@ts/config';
import typeMap from '@ts/typemap';

type OptionState = {
    label: string,
    type: string,
    value: boolean
}

type State = {
    sliders: Array<OptionState>
}

const makeSlider = (label: string, type: string, value: boolean): OptionState => 
    ({ label, type, value });

const resetSliders = (): Array<OptionState> => ([
    makeSlider(labels.sliders.all, typeMap.all, true),
    makeSlider(labels.sliders.photo, typeMap.photo, false),
    makeSlider(labels.sliders.text, typeMap.text, false),
    makeSlider(labels.sliders.ask, typeMap.ask, false),
    makeSlider(labels.sliders.chat, typeMap.chat, false),
    makeSlider(labels.sliders.video, typeMap.video, false),
])

class OptionsState<ContainerType> extends Container {
    state: State = {
        sliders: resetSliders()
    }

    toggle = async (index: number): Promise<void> => {
        if ((this.state.sliders.length < index) || (index < 0)) {
            return;
        }

        const slider: OptionState = this.state.sliders[index];
        const allSlider: ?OptionState = this.state.sliders.find(s => s.label === labels.sliders.all);

        if (slider === allSlider && !slider.value) {
            await this.setState({
                sliders: resetSliders()
            });
        }
        else {
            /* turn off all slider */
            if (allSlider.value && slider.value) {
                const allSlidersIndex = this.state.sliders.findIndex(s => s === allSlider);
                await this.setState({
                    sliders: [
                        ...this.state.sliders.slice(0, allSlidersIndex),
                        makeSlider(labels.sliders.all, false),
                        ...this.state.sliders.slice(allSlidersIndex + 1)
                    ]
                });
            } 

            const sliders = [ 
                ...this.state.sliders.slice(0, index), 
                makeSlider(slider.label, !slider.value), 
                ...this.state.sliders.slice(index + 1)
            ];

            await this.setState({ sliders });
        }
    };
}

export default SlidersState;