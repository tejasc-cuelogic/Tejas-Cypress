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
  const maxlength = props.fielddata.maxLength ? props.fielddata.maxLength : (
    props.maxLength ? props.maxLength : false
  );
  return (
    <Form.Field width={props.containerwidth || false} className={props.containerclassname || ''} error={!!error}>
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
      {props.type === 'password' &&
        <input style={{ opacity: 0, position: 'absolute' }} value="something" />
      }
      <Input
        fluid
        {...props}
        value={value}
        autoComplete="nope"
        maxLength={maxlength || false}
        label={props.prefix || false}
        type={props.type || 'text'}
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
