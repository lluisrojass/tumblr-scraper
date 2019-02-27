/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated'; 
import BlognameContainer from '@ts/containers/Blogname';
import styles from './index.css';
import { 
  type StateT, 
  type SetterT 
} from '@ts/containers/Blogname/types.flow.js';

type Props = {
  blognameState: {
    state: StateT,
    set: SetterT
  }
}

class Textbox extends React.Component<Props> {
    onChange = async (event) => {
      if (event.target instanceof window.HTMLInputElement) {
        const { blognameState } = this.props;
        const { value } = event.target;
        await blognameState.set(value);
      }
    };

    render() {
      const { blognameState } = this.props;
      const { onChange } = this;
      return (
        <div className={styles.wrapper}>
          <input
            type="text"
            onChange={onChange}
            className={styles.input}
            name="blogname"
            value={blognameState.state.blogname}
          />
          <span className={styles.addon}>
            Scrape
          </span>
        </div>
      );
    }
}

export default () => (
  <Subscribe to={[BlognameContainer]}>
    { (blognameState) => (
      <Textbox 
        blognameState={blognameState}
      />
    ) }
  </Subscribe>
);