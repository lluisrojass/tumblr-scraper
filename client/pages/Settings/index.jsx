/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import classnames from 'classnames';
import DisplayContainer from '@client/containers/Display';
import LoopContainer from '@client/containers/Loop';
import type {
  StatusT
} from '@client/containers/Loop/types';
import * as loopStatues from '@client/containers/Loop/status';
import { settings as settingsPage } from '@client/containers/Display/pages';
import PageWrapper from '@client/library/components/SP-Wrapper';
import Box from '@client/library/components/SP-Content-Box';
import Input from '@client/pages/Settings/components/Input';
import ErrorMessage from '@client/pages/Settings/components/Error-Message';
import TypeOptions from '@client/pages/Settings/components/Type-Options';
import GithubAction from '@client/library/components/Github-Action';
import ui from '@client/ui';
import GearIcon from '@client/library/icons/cog.svg';
import ghIconStyles from './gh-action.css';
import styles from './index.css';

type Props = {
  inFocus: boolean,
  loopStatus: StatusT
};

class InputPage extends React.PureComponent<Props> {
  render() {
    const { 
      inFocus,
      loopStatus 
    } = this.props;
    const showGear = !inFocus && [
      loopStatues.prerun,
      loopStatues.running
    ].indexOf(loopStatus) !== -1;

    return (
      <PageWrapper>
        <GearIcon className={classnames(
          styles.icon,
          showGear && styles.visible
        )} />
        <div className={classnames(styles.focus, !inFocus && styles.lost)}>
          <Box className={styles.box}>
            <Input />
            <TypeOptions />
            <ErrorMessage />
          </Box>  
        </div>
        <GithubAction 
          className={ghIconStyles.action}
          label={ui.labels.github.fork}
          path={ui.external.github.paths.fork}
        />
      </PageWrapper>
    );
  }
}


export default () => (
  <Subscribe to={[DisplayContainer, LoopContainer]}>
    {
      (displayContainer, loopContainer) => (
        <InputPage 
          inFocus={displayContainer.state.viewingPage === settingsPage}
          loopStatus={loopContainer.state.status}
        />
      )
    }
  </Subscribe>
);