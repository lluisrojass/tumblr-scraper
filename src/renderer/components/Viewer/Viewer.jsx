import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Viewer.css';
import { LABELS } from 'constants';
import { actions as IPCActions } from 'IPCLibrary';
import { Subscribe } from 'unstated';
import ViewerState from 'containers/Viewer';
import { SYSTEM } from 'constants';

function ViewerComponent(props) {

    if (!props.post) {

        const style = {
            background: `url(${SYSTEM.IMG_DIR}${SYSTEM.IMAGES.EMPTY_VIEWER}) center center no-repeat`,
            backgroundSize: '230px 230px',
            opacity: 0.7,
            height: '100%',
            width: '100%'
        };

        return (<div style={style} />);
    }

    const { 
        headline,
        datePublished,
        articleBody: body,
        isVideo,
        videoURL,
        images = [],
        url
    } = props.post;

    return (
        <div>
            { headline && <h1 className={classnames(styles.header)}>{ headline }</h1> }
            { datePublished && <a className={classnames(styles.date)}>{ datePublished }</a> }
            { body && <p className={classnames(styles.article)}>{ body }</p> }
            { isVideo && ( videoURL ? 
                <div className={classnames(styles.videoWrapper)}> 
                    <iframe frameBorder='0' src={ videoURL } />
                </div> 
                : 
                <p>{ LABELS.VIDEO_PREVIEW_ERROR }</p> 
            ) }
            { images.length > 0 && 
                <div className={classnames(styles.imageWrapper)}> 
                    { images.map((url, index) => (
                        <img 
                            key={ index }
                            src={ url }
                            className={classnames(styles.image)}
                        />
                    ) ) }
                </div> 
            }
            { url && 
                <div className={classnames(styles.urlWrapper)}>
                    <a 
                        rel='noopener noreferrer' 
                        onClick={() => IPCActions.openInBrowser(url)}
                        className={classnames(styles.openInBrowser)}
                    >
                        { LABELS.OPEN_IN_BROWSER }
                    </a>
                </div>
            }
        </div>
    );
}

ViewerComponent.propTypes = {
    post: PropTypes.oneOf( PropTypes.object )
};

const Viewer = () => (
    <Subscribe to={[ ViewerState ]}>
        { (viewerState) => (
            <ViewerComponent post={viewerState.state} />
        ) }
    </Subscribe>
);

export { Viewer };