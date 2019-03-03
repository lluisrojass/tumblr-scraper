import * as React from 'react';
import Accordion from '@ts/base-components/Accordion';
import styles from './index.css';

class MessageAccordion extends React.PureComponent<> {
  state = {
    opened: true
  };
  
  close = () => {
    this.setState({
      opened: false
    });
  }

  open = () => {
    this.setState({
      opened: true
    });
  }

  render() {
    const {
      opened
    } = this.state;
    const {
      close,
      open
    } = this;
    return (
      <Accordion 
        height={98} 
        opened={opened}
        panelClassName={styles.outer}
        contentClassName={styles.inner}
        close={close}
        orientation="bottom"
        isOpenable
        open={open}>
      </Accordion>
    );
  }
}

export default MessageAccordion;