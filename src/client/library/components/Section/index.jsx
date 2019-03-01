/* @flow */
import * as React from 'react';
import styles from './index.css';

type Props = {
  title?: ?string,
  children: any
}

const Section = (props: Props) => {
  return (
    <div className={styles.section}>
      { !!props.title && (
        <h2 className={styles.sectionTitle}><span>{ props.title }</span></h2>
      ) }
      <div>
        { props.children }
      </div>
    </div>
  );
};

export default Section;