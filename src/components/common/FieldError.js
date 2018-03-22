import React from 'react';

const FieldError = (props) => {
  if (props.error) {
    return (<div className="field-error-message">{props.error}</div>);
  }
  return null;
};

export default FieldError;
