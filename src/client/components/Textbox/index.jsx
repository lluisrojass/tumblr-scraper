/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import { Subscribe } from 'unstated'; 
import BlognameContainer from '@ts/containers/Blogname';
import BlogTypeContainer from '@ts/containers/Blog-Type-Options';
import styles from './index.css';
import { 
  type StateT, 
  type SetterT 
} from '@ts/containers/Blogname/types.flow.js';
import { 
  type OptionT
} from '@ts/containers/Blog-Type-Options/types.flow.js';
type Props = {
  blognameState: StateT,
  setBlogname: SetterT,
  blogType: ?OptionT
}
class Textbox extends React.PureComponent<Props> {
    onChange = async (event) => {
      if (event.target instanceof window.HTMLInputElement) {
        const { setBlogname, blogType } = this.props;
        if (blogType == null) {
          return;
        }
        const { value } = event.target;
        await setBlogname(value, blogType.type);
      }
    };
    
    componentDidUpdate(prevProps) {
      if (this.props.blogType !== prevProps.blogType) {
        const { blognameState, blogType } = this.props;
        if (blogType == null) {
          return;
        }
        this.props.setBlogname(blognameState.blogname, blogType.type);
      }
    }

    render() {
      const { blognameState } = this.props;
      const { onChange } = this;
      return (
        <div className={styles.wrapper}>
          <input
            type="text"
            onChange={onChange}
            className={classnames(
              styles.input,
              blognameState.status === 'CLEAR' && styles.clear,
              blognameState.status === 'ERROR' && styles.error,
              blognameState.status === 'GOOD' && styles.good,
            )}
            name="blogname"
            value={blognameState.blogname}
          />
          <span className={styles.addon}>
            {blognameState.status === 'CLEAR' && 'Scrape'}
            {blognameState.status === 'ERROR' && 'x'}
            {blognameState.status === 'GOOD' && 'Scrape'}
          </span>
        </div>
      );
    }
}

export default () => (
  <Subscribe to={[BlognameContainer, BlogTypeContainer]}>
    { (blognameContainer, blogtypeContainer) => (
      <Textbox 
        blognameState={blognameContainer.state}
        setBlogname={blognameContainer.set}
        blogType={blogtypeContainer.state.options.find(o => o.value)}
      />
    ) }
  </Subscribe>
);