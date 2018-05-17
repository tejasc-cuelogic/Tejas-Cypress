import React from 'react';
// import { Label } from 'semantic-ui-react';

const FieldError = (props) => {
  if (props.error) {
    // return (<div className="field-error-message">{props.error}</div>);
    // return (<Label basic color="red" pointing>{props.error}</Label>);
    return (<p className="field-error">{props.error}</p>);
  }
  return null;
};

export default FieldError;
