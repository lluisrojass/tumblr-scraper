import { Container, type ContainerType } from 'unstated';

type State = {
    date: string,
    path: string
}

class DepthState<ContainerType> extends Container {
    state: State = {
        date: '',
        path: ''
    }

    setDate = async (date: string): Promise<void> => {
        await this.setState({ date });
    }

    setPath = async (path: string): Promise<void> => {
        await this.setState({ path });
    };

    reset = async (): Promise<void> => {
        await this.setState({
            date: '',
            path: ''
        });
    };

}

export default DepthState;