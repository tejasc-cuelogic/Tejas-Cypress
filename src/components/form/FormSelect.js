/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Select } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormSelect = observer((props) => {
  const {
    label,
    value,
    error,
    placeHolder,
  } = props.fielddata;
  let width = '';
  if (props.containerwidth) {
    width = props.containerwidth;
  }
  return (
    <Form.Field {...width}>
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
        placeholder={placeHolder}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormSelect;
