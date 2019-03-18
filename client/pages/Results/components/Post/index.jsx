/* @flow */
import * as React from 'react';
import styles from './index.css';

type Props = {
  images: Array<string>,
  title?: string,
  description?: string
};

class Post extends React.PureComponent<Props> {

  renderImage = (src: string) => {
    return (
      <span
        style={{
          backgroundImage: `url(${src})`
        }}
        className={styles.image}
      />
    );
  };

  render() {
    const { images, title, description } = this.props;
    return (
      <div className={styles.post}>
        <div className={styles.postDescription}>
          { !!images.length && (
            <div className={styles.imageWrapper}>
              { this.renderImage(images[0]) }
            </div>
          ) }
          { !!title && (
            <span className={styles.title}>
              {`${title} • `}
            </span>
          ) }
          { !!description && (
            <span className={styles.description}>
              {description}
            </span>
          ) }
        </div>
        <div className={styles.extraDetails}>
          <span className={styles.date}>
            09/14/18 
          </span>
          <span className={styles.dot} /> 
          <span className={styles.postType}>
            photo post
          </span>
          <span className={styles.dot} /> 
          <span className={styles.numImages}>
            3 Images
          </span>
        </div>
      </div>
    );
  }
}

export default Post;