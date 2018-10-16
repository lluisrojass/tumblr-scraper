import { Container } from 'unstated';

class DepthState extends Container {
    constructor() {
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                date: '',
                path: ''
            }
        });

        this.state = this._state;
    }

    setDateDepth = async (date) => {
        if (!typeof date === 'string') {
            return false;
        }

        await this.setState({
            date
        });
    }

    setPathDepth = async (path) => {
        if (!typeof path === 'string') {
            return false;
        }

        await this.setState({
            path
        });
    };

    reset = async () => {
        this.setState(this._state);
    };

}

export default DepthState;