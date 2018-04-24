/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Form, Popup, Icon, Select } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormSelect = props => (
  <Form.Field width={props.containerwidth || false} error={props.error !== ''}>
    <label>
      {props.fielddata.label}
      {props.tooltip &&
        <Popup
          trigger={<Icon name="help circle outline" />}
          content={props.tooltip}
          position="top center"
          className="center-align"
        />
      }
    </label>
    <Select
      fluid
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

export default FormSelect;
