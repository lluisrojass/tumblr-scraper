import * as React from 'react';
import classnames from 'classnames';
import { Subscribe } from 'unstated';
import styles from './index.css';
import ArrowIcon from '@ts/lib/icons/go.svg';
import XIcon from '@ts/lib/icons/close.svg';
import RippleLoader from '@ts/base-components/Ripple-Loader';
import BlogTypeContainer from '@ts/containers/Type-Options';
import BlognameContainer from '@ts/containers/Blogname';

type Props = {
  children: any,
  isTyping: boolean,
  typingStatus: string,
  hasSelectedTypes: boolean,
  containsInput: boolean
};

class WithIcons extends React.PureComponent<Props> {
  render() {
    const { props } = this;
    const shouldShowLoader = props.isTyping;
    const hasError = (props.hasTextError || !props.hasSelectedTypes);
    const shouldShowError = !shouldShowLoader && hasError;
    const shouldShowGo = !shouldShowLoader && !shouldShowError;
    const shouldBeAllowedToGo = shouldShowGo && 
      !hasError && props.containsInput;

    return (
      <div className={styles.invisible}>
        <>
          <div className={classnames(
            styles.pulseWrapper,
            shouldShowLoader && styles.visible
          )}>
            <RippleLoader />
          </div>
          <XIcon className={classnames(
            styles.xIcon,
            shouldShowError && styles.visible
          )} />
          <ArrowIcon className={classnames(
            styles.arrowIcon,
            shouldShowGo && styles.visible,
            shouldBeAllowedToGo && styles.withColor
          )} />
        </>
        { this.props.children }
      </div>
    );
  }
}

type SProps = {
  children: any
};

export default (props: SProps) => (
  <Subscribe to={[BlogTypeContainer, BlognameContainer]}>
    {
      (btContainer, bnContainer) => (
        <WithIcons
          hasTextError={bnContainer.state.status === 'ERROR'}
          isTyping={bnContainer.state.isTyping}
          hasSelectedTypes={btContainer.state.options.findIndex(
            (option) => option.value
          ) !== -1}
          containsInput={!!bnContainer.state.blogname}
        >
          { props.children }
        </WithIcons>
      )
    }
  </Subscribe>
);