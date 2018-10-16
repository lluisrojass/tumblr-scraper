'use strict';

import React from 'react';
import classnames from 'classnames';

import styles from './Application.css';
import Panel from '../PanelWrapper/';
import Header from '../Header/';
import IPCHandler from '../IPC';

import Options from '../Options';
import Footer from '../Footer';
import Blogname from '../Blogname';
import Buttons from '../Buttons';
import Viewer from '../Viewer';
import PostList from '../PostList';
import Notification from '../Notification';

function Application() {
    return (
        <div className={classnames(styles.appWrapper)}>
            <IPCHandler />
            <div className={classnames(styles.panelWrapper)}>
                <Panel width={25}>
                    <Header> Options </Header>
                    <Options />
                    <Blogname />
                    <Buttons />
                    <Notification />
                </Panel>
                <Panel width={37.5}>
                    <PostList />
                </Panel>
                <Panel width={37.5}>
                    <Viewer />
                </Panel>
            </div>
            <Footer />
        </div>
    );
}

export { Application };