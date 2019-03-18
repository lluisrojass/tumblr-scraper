/* @flow */
import * as React from 'react';
import { Subscribe } from 'unstated';
import classnames from 'classnames';
import BlognameContainer from '@client/containers/Blogname';
import TypesContainer from '@client/containers/Types';
import ui from '@client/ui';
import styles from './index.css';

type Props = {
  isTyping: boolean,
  noSelectedTypes: boolean,
  textErrorMessage: string
};

const ErrorMessage = (props: Props) => {
  const selectedError = props.noSelectedTypes;
  const textError = (!props.isTyping && props.textErrorMessage);

  return (
    <span className={
      classnames(
        styles.errorMessage,
        (selectedError || textError) && styles.visible
      )}
    >
      { selectedError ? ui.labels.errors.noTypesSelected : textError ? props.textErrorMessage : ''}
    </span>
  );
};

export default () => (
  <Subscribe to={[BlognameContainer, TypesContainer]}>
    {
      (blognameContainer, typesContainer) => (
        <ErrorMessage
          isTyping={blognameContainer.state.isTyping}
          noSelectedTypes={typesContainer.state.options.findIndex(
            (option) => option.value
          ) === -1}
          textErrorMessage={blognameContainer.state.errorMessage}
        />
      )
    }
  </Subscribe>
);
