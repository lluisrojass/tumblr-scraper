/* @flow */
import * as React from 'react';
import styles from './index.css';
import Section from '@ts/base-components/Section';
import Panel from '@ts/base-components/Panel';
import Header from '@ts/components/Header/';
import TypeOptions from '@ts/components/Type-Options';
import BlogTypeSlider from '@ts/components/Blog-Type-Slider';
import Textbox from '@ts/components/Textbox';
import Accordion from '@ts/components/Message-Accordion';
import config from '@ts/config';
import '@ts/global-styles';

const Application = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleBar} />
      <div className={styles.content}>
        <Panel width={33.33} className={styles.foregroundPanel}>
          <Accordion />
          <Section>
            <Header>{ config.title }</Header>
          </Section> 
          <Section>
            <TypeOptions />
          </Section>
          <Section>
            <BlogTypeSlider />
          </Section> 
          <Section>
            <Textbox />
          </Section>
        </Panel>
        <Panel width={33.33} className={styles.backgroundPanel}></Panel>
        <Panel width={33.33} className={styles.backgroundPanel}></Panel>
      </div>
    </div>
  );
};

export default Application;