import React from 'react';

const FieldError = (props) => {
  if (props.error) {
    return (<div>{props.error}</div>);
  }
  return null;
};

export default FieldError;
