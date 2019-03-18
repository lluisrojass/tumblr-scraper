/* @flow */
import * as React from 'react';
import classnames from 'classnames';
import Icon from '@client/library/icons/github.svg';
import { ipcRenderer } from 'electron';
import styles from './index.css';

type Props = {
  label: string,
  className?: string,
  path?: string
};

class GithubAction extends React.PureComponent<Props> {

  host = 'https://github.com';

  onClick = () => {
    const { path } = this.props;
    if (path) {
      const url = this.host + path;
      ipcRenderer.send('open-url', url);
    }
  }

  render() {
    const { 
      props, 
      onClick 
    } = this;
    return (
      <a className={classnames(
        styles.action, 
        props.className
      )}
      onClick={onClick}
      >
        <Icon /><span>{ props.label }</span>
      </a>
    );
  }
}

export default GithubAction;