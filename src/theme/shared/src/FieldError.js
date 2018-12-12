import React from 'react';
import { Icon } from 'semantic-ui-react';

const FieldError = (props) => {
  if (props.error) {
    return (
      <p className={`${props.className ? `${props.className} field-error` : 'field-error'}`}>
        {props.icon &&
          <Icon name={props.icon} />}
        {props.error}
      </p>);
  }
  return null;
};

export default FieldError;
