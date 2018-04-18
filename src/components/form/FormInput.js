/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FormInput = observer((props) => {
  const {
    label,
    error,
    tooltip,
    placeHolder,
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
      <Form.Input
        fluid
        {...props}
        label={false}
        type={props.type || 'text'}
        error={error}
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
