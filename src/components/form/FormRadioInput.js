/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Form } from 'semantic-ui-react';

const FormRadioInput = props => (
  <Form.Radio
    {...props}
    label={props.label}
    value={props.value}
    checked={props.checked}
    onChange={props.changed}
  />
);

export default FormRadioInput;
