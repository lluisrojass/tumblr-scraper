import React from 'react';
import classnames from 'classnames';
import styles from './Application.css';
import Panel from 'components/PanelWrapper/';
import Header from 'components/Header/';
import Options from 'components/Options';
import Textbox from 'components/Textbox';
import ButtonComposer from 'components/ButtonComposer';
import Viewer from 'components/Viewer';
import PostList from 'components/PostList';
import attachButtons from 'library/attachButtons';

const Application = () => (
    <div className={classnames(styles.appWrapper)}>
        <div className={classnames(styles.panelWrapper)}>
            <Panel width={25} className={styles.backgroundPanel}>
                <Header> Settings </Header>
                <Options />
                <Textbox />
                {attachButtons(ButtonComposer)}
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                <PostList />
            </Panel>
            <Panel width={37.5} className={styles.foregroundPanel}>
                <Viewer />
            </Panel>
        </div>
    </div>
);


export { Application };