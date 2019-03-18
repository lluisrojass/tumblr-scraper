/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import classnames from 'classnames';
import DisplayContainer from '@client/containers/Display';
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
  inFocus: boolean
};

const InputPage = (props: Props) => (
  <PageWrapper>
    <GearIcon className={classnames(
      styles.icon,
      !props.inFocus && styles.visible
    )} />
    <div className={classnames(styles.focus, !props.inFocus && styles.lost)}>
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

export default () => (
  <Subscribe to={[DisplayContainer]}>
    {
      (displayContainer) => (
        <InputPage 
          inFocus={displayContainer.state.viewingPage === settingsPage}
        />
      )
    }
  </Subscribe>
);