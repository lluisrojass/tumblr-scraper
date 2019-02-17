import React from 'react';
import classnames from 'classnames';
import styles from './index.css';
import Panel from '@ts/components/PanelWrapper';
// import Header from 'components/Header/';
import Options from '@ts/components/Options';
// import Textbox from 'components/Textbox';
// import ButtonComposer from 'components/ButtonComposer';
// import Viewer from 'components/Viewer';
// import PostList from 'components/PostList';
// import attachButtons from 'library/attachButtons';

/* 
<div className={classnames(styles.panelWrapper)}>
            <Panel width={25} className={styles.backgroundPanel}>
                <Header> Settings </Header>
                <Options />
                <Textbox />
                {attachButtons(ButtonComposer)}
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                
            </Panel>
        </div>

*/

const Application = () => (
    <div className={classnames(styles.appWrapper)}>
        <Panel width={30} className={styles.foregroundPanel}></Panel>
        <Panel width={34.95} className={styles.backgroundPanel}></Panel>
        <Panel width={34.95} className={styles.backgroundPanel}></Panel>
    </div>
);


export default Application;