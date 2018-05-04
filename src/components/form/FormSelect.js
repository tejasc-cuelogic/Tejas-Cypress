/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Select } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormSelect = observer((props) => {
  const { label, value, error } = props.fielddata;
  return (
    <Form.Field width={props.containerwidth || false}>
      <label>
        {label}
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
        value={value}
        error={!!error}
        onChange={props.changed}
      />
      <div className="dropdown-effect">{props.fielddata.label}</div>
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormSelect;
