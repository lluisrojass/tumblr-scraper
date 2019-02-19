const tumblr = {
    /* MUST have same property names as LABELS.SLIDERS */
    TYPES: {
        PHOTO: 'is_photo',
        CHAT: 'is_chat',
        ASK: 'is_note',
        VIDEO: 'is_video',
        TEXT: 'is_regular'
    },
    PARSE_FLAGS: {
        NEXT_PAGE: 'next_page_link',
        DATE: 'date'
    }
};

const NOTIFICATION_TYPES = {
    _INVALID: -1,
    ERROR: 0,
    WARNING: 1,
    SUCCESS: 2
};

const MAIN_EVENTS = {
    PARSER: {
        PAGE: 'page',
        POST: 'post',
        DATE: 'date'
    },
    LOOP: {
        STOPPED: 'stopped'
    }
    
};


if (typeof exports === 'object') {
    module.exports = {
        IPC,
        LABELS,
        SYSTEM,
        TUMBLR,
        NOTIFICATION_TYPES,
        MAIN_EVENTS
    };
}

export {
    IPC,
    LABELS,
    SYSTEM,
    TUMBLR,
    NOTIFICATION_TYPES,
    MAIN_EVENTS
};
