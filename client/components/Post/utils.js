import { SYSTEM } from 'constants';
import L_CONSTANTS from './constants';

const validateString = (str) => typeof str === 'string' && str && str.length > 0;

const placeholderImageSrc = (type) => 
    SYSTEM.IMG_DIR + L_CONSTANTS.PLACEHOLDER_IMAGE_FILES[type.toUpperCase()];

function dateShorten(dateString) {
    const m = dateString.match(/[^T\:]+/i);
    if (m && m.length > 0) {
        return m[0];
    }

    return '';
}

function exactMatch(regex, str) {
    const match = str.match(regex);
    return match != null && str == match[0];
}

function downsizeResolution(imageUrl) {
    if (validateString(imageUrl)) {
        const i = imageUrl.length - 8;
        const resolution = imageUrl.substring(i);

        if (exactMatch(/1280\..{3,4}/, resolution)) {
            return imageUrl.slice(0, i) + '250' + imageUrl.slice(i - 4);
        }
    }
    
    return imageUrl;
}

export {
    validateString,
    dateShorten,
    placeholderImageSrc,
    exactMatch,
    downsizeResolution
};

