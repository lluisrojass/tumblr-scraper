import { Container } from 'unstated';
import { NOTIFICATION_TYPES } from 'constants';

class NotificationState extends Container {
    constructor() {
        super();
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                type: NOTIFICATION_TYPES._INVALID,
                notification: ''
            }
        });

        this.state = this._state;
    }

    reset = async () => {
        this.setState(this._state);
    }

    notify = async (TYPE, message) => {
        await this.setState({
            type: TYPE,
            notification: message
        });
    }
}

export default NotificationState;