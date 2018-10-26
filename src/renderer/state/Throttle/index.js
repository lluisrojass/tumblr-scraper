import { Container } from 'unstated';

class ThrottleState extends Container {
    constructor() {
        super();
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                throttle: false
            }
        });

        this.state = this._state;
    }

    setThrottleValue = async ( val ) => {
        await this.setState({
            throttle: !!val
        });
    }

    reset = async () => {
        this.setState(this._state);
    }
}

export default ThrottleState;