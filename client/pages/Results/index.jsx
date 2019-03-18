/* @flow */ 
import * as React from 'react';
import { Subscribe } from 'unstated';
import classnames from 'classnames';
import DisplayContainer from '@client/containers/Display';
import { results as resultsPage } from '@client/containers/Display/pages';
import Button from '@client/pages/Results/components/Button';
import SwitchIcon from '@client/library/icons/switcher.svg';
import InfoIcon from '@client/library/icons/info.svg';
import PostList from '@client/pages/Results/components/Post-List';
import styles from './index.css';

type Props = {
  inFocus: boolean
};

class ResultsPage extends React.PureComponent<Props> {
  renderButtons = () => {
    return (
      <>
        <Button className={classnames(styles.pauseButton)}>
          pause
        </Button>
        <Button className={classnames(styles.infoButton)}>
          <InfoIcon className={styles.infoIcon} />
        </Button>
        <Button className={classnames(styles.switcherButton)}>
          <SwitchIcon 
            className={styles.switcherIcon} 
          />
        </Button>
      </>
    );
  };

  render() {
    const { 
      inFocus 
    } = this.props;
    
    return (
      <div className={classnames(
        styles.wrapper,
        inFocus && styles.visible
      )}>
        <div className={styles.nav}>
          { this.renderButtons() }
        </div>
        <div className={styles.results}>
          <div className={styles.pane}>
            <PostList />
          </div>
          <div className={styles.pane} />
        </div>
      </div>
    );
  }  
}

export default () => (
  <Subscribe to={[DisplayContainer]}>
    {
      (displayContainer) => (
        <ResultsPage
          inFocus={displayContainer.state.viewingPage === resultsPage}
        />
      )
    }
  </Subscribe>
);
