/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Input } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormInput = observer((props) => {
  const {
    label,
    error,
    tooltip,
    placeHolder,
    value,
  } = props.fielddata;
  return (
    <Form.Field>
      <label>
        {label}
        {tooltip &&
          <Popup
            trigger={<Icon name="help circle outline" />}
            content={tooltip}
            position="top center"
            className="center-align"
          />
        }
      </label>
      <Input
        fluid
        labeled
        {...props}
        value={value}
        type={props.type || 'text'}
        error={!!error}
        placeholder={placeHolder}
        onChange={props.changed}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormInput;
