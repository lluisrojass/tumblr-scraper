const IPC = {
    EVENTS: {
        POST_DISCOVERED: 'POST_DISCOVERED',
        DATE_DISCOVERED: 'DATE_DISCOVERED',
        PAGE_DISCOVERED: 'PAGE_DISCOVERED',
        LOOP_TIMEOUT: 'FATAL_TIMEOUT',
        LOOP_END: 'END',
        LOOP_ERROR: 'FATAL_ERROR',
        LOOP_WARNING: 'WARNING',
        IMAGE_LOADED: 'IMAGE_LOADED',
        RESPONSE: {
            START: 'STARTED',
            CONTINUE: 'CONTINUED',
            STOP: 'STOPPED',
            THROTTLE: 'THROTTLE_SET'
        }
    },
    REQUESTS: {
        START: 'START_REQUEST',
        CONTINUE: 'CONTINUE_REQUEST',
        STOP: 'STOP_REQUEST',
        THROTTLE: 'THROTTLE_REQUEST',
        OPEN_IN_BROWSER: 'OPEN_IN_BROWSER'
    },
    PACKAGE: {
        ASYNC_REPLY: 'asynchronous-reply',
        ASYNC_REQUEST: 'asynchronous-message',
    }
};

const LABELS = {
    ERRORS: {
        COULD_NOT_CONTINUE: 'unknown error: could not continue.',
        TIMEOUT: 'fatal error: request timed out.',
        GENERIC_FATAL: 'unknown fatal error occured.',
        GENERIC_NONFATAL: 'unknown nonfatal error occured.',
        VIDEO_PREVIEW_ERROR: 'video preview unavailable',
        BLOGNAME: {
            MISSING: 'enter a blogname',
            TOO_LONG: 'blog name must be 32 characters or less',
            INVALID: 'invalid blog name'
        }
    },
    SLIDERS: {
        ALL: 'all',
        PHOTO: 'photo',
        CHAT: 'chat',
        ASK: 'ask',
        VIDEO: 'video',
        TEXT: 'text'
    },
    FINISHED: 'finished',
    BUTTONS: {
        START: 'start',
        RESUME: 'resume',
        PAUSE: 'pause'
    },
    OPEN_IN_BROWSER: 'View in Browser'
};

const SYSTEM = {
    IMG_DIR: 'public/img/',
    IMAGES: {
        EMPTY_VIEWER: 'not_selected.png'
    }
};

const TUMBLR = {
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
