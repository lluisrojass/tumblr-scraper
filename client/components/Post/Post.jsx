import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import pathOr from 'lodash/fp/pathOr';
import truncate from 'lodash/truncate';
import capitalize from 'lodash/capitalize';
import constants from './constants';
import styles from './Post.css';
import { 
    placeholderImageSrc, 
    downsizeResolution, 
    dateShorten, 
    validateString 
} from './utils.js';

class Post extends React.Component {

    static propTypes = {
        onLoad: PropTypes.func,
        onClick: PropTypes.func
    };

    image() {
        const images = pathOr([], 'images', this.props);
        const type = pathOr(false, 'type', this.props);

        const hasPreview = Array.isArray(images) && images.length > 0;
        const source = hasPreview ?  downsizeResolution(images[0]) : placeholderImageSrc(type);

        return (
            <div className={classnames(styles.imageWrapper)}>
                <img
                    src={source}
                    onLoad={hasPreview ? this.props.onLoad : null}
                    className={classnames(styles.image)}
                />
            </div>
        );
    }

    stamp = num => (
        <div className={classnames(styles.stamp)}>{`${num} images`}</div>
    );

    title(headline, isPhotoset, type) {
        const hasHeadline = validateString(headline);
        const displayText = hasHeadline ? truncate(headline, {   
            length: isPhotoset ? constants.TITLE_LIMIT_LOW : constants.TITLE_LIMIT_HIGH,
            // TODO: check if this is good use
            separator: /[ .\-,]+/
        }) : capitalize(`${type} Post`);
        
        return (
            <h1 className={classnames(styles.title)}>
                {displayText}        
            </h1>
        );
    }

    date = datePublished => validateString(datePublished) ? (
        <h1 className={classnames(styles.date)}>
            {dateShorten(datePublished)}
        </h1>
    ) : null;

    postBody = body => validateString(body) ? (
        <p className={classnames(styles.body)}>
            {truncate(body, {
                length: constants.BODY_LIMIT,
                // TODO: check if this is good use
                separator: /[ .\-,]+/
            })}
        </p>
    ) : null;

    info() {
        const images = pathOr([], 'images', this.props);
        const headline = pathOr('', 'headline', this.props);
        const type = pathOr('', 'type', this.props);
        const datePublished = pathOr('', 'datePublished', this.props);
        const body = pathOr('', 'articleBody', this.props);
        let numImages = 0;
        const isPhotoset = Array.isArray(images) && (numImages = images.length, numImages > 1);

        return (
            <div className={classnames(styles.postContent)}>
                <div className={classnames(styles.headline)}>
                    {isPhotoset && this.stamp(numImages)}
                    {this.title(headline, isPhotoset, type)}
                    {this.date(datePublished)}
                </div>
                {this.postBody(body)}
            </div>
        );
    }

    render() {
        return (
            <div className={classnames(styles.post)} onClick={this.props.onClick}>
                {this.image()}
                {this.info()}
            </div>
        );
    }
}


export { Post };