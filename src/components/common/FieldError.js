import React from 'react';

const FieldError = (props) => {
  if (props.error) {
    return (<div className="error">{props.error}</div>);
  }
  return null;
};

export default FieldError;
