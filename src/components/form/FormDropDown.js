/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormDropDown = props => (
  <Form.Field width={props.containerwidth || false}>
    <label>
      {props.label}
      {props.tooltip &&
        <Popup
          trigger={<Icon name="help circle outline" />}
          content={props.tooltip}
          position="top center"
          className="center-align"
        />
      }
    </label>
    <Form.Select
      fluid
      search
      {...props}
      label={false}
      error={!!props.error}
      onChange={props.changed}
    />
    {props.error &&
      <FieldError error={props.error} />
    }
  </Form.Field>
);

export default FormDropDown;
