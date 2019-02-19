export type NotifType = -1 | 0 | 1 | 2;

type NotifTypes = {
    _invalid: NotifType,
    error: NotifType,
    warning: NotifType,
    success: NotifType
}

export const notificationTypes: NotifTypes = {
    _invalid: -1,
    error: 0,
    warning: 1,
    success: 2
};