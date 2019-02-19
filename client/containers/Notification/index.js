/* @flow */
import { Container, type ContainerType } from 'unstated';
import { notificationTypes, type NotifType } from '@ts/lib/constants';

type State = {
    type: NotifType,
    notification: string
}

class NotificationState<ContainerType> extends Container {
    state: State = {
        type: notificationTypes._invalid,
        notification: ''
    }

    reset = async (): Promise<void> => {
        this.setState({
            type: notificationTypes._invalid,
            notification: ''
        });
    }

    notify = async (type: NotifType, message: string): Promise<void> => {
        await this.setState({
            type,
            notification: message
        });
    }
}

export default NotificationState;