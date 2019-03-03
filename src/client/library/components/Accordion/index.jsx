import * as React from 'react';
import classnames from 'classnames';
import styles from './index.css';
import noop from '@ts/lib/utils/common';

type Props = {
    height: number,
    children: any,
    opened: boolean,
    isOpenable: boolean,
    panelClassName?: string,
    contentClassName?: string,
    close: () => void | Promise<void>,
    open: () => void | Promise<void>,
    orientation: 'top' | 'bottom'
};

const Accordion = (props: Props) => {
  const { 
    children, 
    height,
    opened,
    close,
    open,
    contentClassName,
    panelClassName,
    isOpenable,
    orientation
  } = props;

  const onClick = opened ? 
    close : (isOpenable ? open : noop);
  
  return (
    <div 
      onClick={onClick}
      className={classnames( 
        styles.basePanel,
        orientation === 'top' && styles.topPanel,
        orientation === 'bottom' && styles.bottomPanel,
        opened && styles.openPanel,
        panelClassName,
      )}
      style={ {
        height: `${height}%`,
        bottom: orientation === 'bottom' ? 
          opened ? 0 : 'calc(-100% + 36px)'
          :
          undefined,
        top: orientation === 'top' ?
          opened ? 0 : `calc(-${height}% + 27px)`
          : 
          undefined
      }}
    >
      <div className={classnames(
        styles.content,
        contentClassName
      )}>
        { children }
      </div>
      <span 
        className={classnames(
          styles.peeking,
          isOpenable && styles.clickable,
          opened && styles.open
        )}>
        <span className={classnames(
          styles.part,
          orientation === 'top' && styles.top,
          orientation === 'bottom' && styles.bottom
        )} />
        <span className={classnames(
          styles.part,
          orientation === 'top' && styles.top,
          orientation === 'bottom' && styles.bottom
        )} />
      </span>
    </div>
  );
};

export default Accordion;