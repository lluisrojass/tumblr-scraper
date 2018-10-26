'use strict';

import React from 'react';
import classnames from 'classnames';

import styles from './Application.css';
import Panel from 'components/PanelWrapper/';
import Header from 'components/Header/';
import IPCHandler from 'components/IPCHandler';

import Options from 'components/Options';
import Footer from 'components/Footer';
import Blogname from 'components/Blogname';
import ButtonComposer from 'components/ButtonComposer';
import Viewer from 'components/Viewer';
import PostList from 'components/PostList';
import Notification from 'components/Notification';
import attachButtons from 'library/attachButtons';

const Application = () => (
    <div className={classnames(styles.appWrapper)}>
        <IPCHandler />
        <div className={classnames(styles.panelWrapper)}>
            <Panel width={25} className={styles.backgroundPanel}>
                <Header> Options </Header>
                <Options />
                <Blogname />
                {attachButtons(ButtonComposer)}
                <Notification />
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                <PostList />
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                <Viewer />
            </Panel>
        </div>
        <Footer />
    </div>
);


export { Application };