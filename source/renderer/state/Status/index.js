import { Container } from 'unstated';

class StatusState extends Container {
    constructor() {
        super();
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                isCompleted: false,
                isExecuting: false,
                isRunning: false
            }
        });

        Object.defineProperty(this, '_runningState', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                isCompleted: false,
                isExecuting: true,
                isRunning: true
            }
        });

        Object.defineProperty(this, '_pausedState', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                isCompleted: false,
                isExecuting: true,
                isRunning: false
            }
        });

        Object.defineProperty(this, '_successState', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                isCompleted: true,
                isExecuting: true,
                isRunning: false
            }
        });

        this.state = this._state;
    }

    startRunning = async () => {
        if (!this._runningState) {
            return;
        }

        await this.setState(this._runningState);
    };

    pauseRunning = async () => {
        if (!this._pausedState) {
            return;
        }

        await this.setState(this._pausedState);
    };

    complete = async () => {
        if (!this._successState) {
            return;
        }

        await this.setState(this._successState);
    }

    reset = async () => {
        if (!this._state) {
            return;
        }

        await this.setState(this._state);
    };
}

export default StatusState;