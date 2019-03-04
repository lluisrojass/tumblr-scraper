/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import { Subscribe } from 'unstated'; 
import BlognameContainer from '@ts/containers/Blogname';
import BlogTypeContainer from '@ts/containers/Blog-Type-Options';
import styles from './index.css';
import ArrowIcon from '@ts/lib/icons/go.svg';
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

class Input extends React.PureComponent<Props> {
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
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Scrape a Blog"
            onChange={onChange}
            className={classnames(
              styles.input
            )}
            name="blogname"
            value={blognameState.blogname}
          />
          <ArrowIcon className={styles.arrowIcon} />
        </div>
      );
    }
}

export default () => (
  <Subscribe to={[BlognameContainer, BlogTypeContainer]}>
    { (blognameContainer, blogtypeContainer) => (
      <Input 
        blognameState={blognameContainer.state}
        setBlogname={blognameContainer.set}
        blogType={blogtypeContainer.state.options.find(o => o.value)}
      />
    ) }
  </Subscribe>
);