/* @flow */
import { Container, type ContainerType } from 'unstated';

type State = {
    blogname: string
};

class BlognameState<ContainerType> extends Container {
    state: State = {
        blogname: ''
    };

    set = async (text: string): Promise<void> => {
        await this.setState({ blogname: text });
    };

    reset = async (): Promise<void> => {
        await this.setState({ blogname: '' });
    };
}

export default BlognameState;