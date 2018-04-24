/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import FieldError from '../common/FieldError';

/* eslint-disable arrow-body-style */
const MaskedInput = observer((props) => {
  const { label, error, value } = props.fielddata;
  return (
    <Form.Field>
      <label>
        {!props.hidelabel && label}
        {props.tooltip &&
          <Popup
            trigger={<Icon name="help circle outline" />}
            content={props.tooltip}
            position="top center"
            className="center-align"
          />
        }
      </label>
      <InputMask
        {...props}
        label={false}
        value={value}
        onChange={props.changed}
        error={error}
        alwaysShowMask
        maskChar=" "
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput;
