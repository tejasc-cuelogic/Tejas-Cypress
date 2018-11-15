import React from 'react';
import { Icon } from 'semantic-ui-react';

const FieldError = (props) => {
  if (props.error) {
    return (
      <p className={`${props.classname ? `${props.classname} field-error` : 'field-error'}`}>
        {props.icon &&
          <Icon name={props.icon} />}
        {props.error}
      </p>);
  }
  return null;
};

export default FieldError;
