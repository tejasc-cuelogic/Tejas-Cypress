/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Input } from 'semantic-ui-react';
import { FieldError } from '../../shared';

const FormLabelInput = observer((props) => {
  const {
    label,
    error,
    tooltip,
    placeHolder,
  } = props.fielddata;
  const { displayMode, readOnly } = props;
  return (
    <Form.Field>
      <label>
        {label}
        {tooltip
          && (
          <Popup
            trigger={<Icon className="ns-help-circle" />}
            content={tooltip}
            position="top center"
            className="center-align"
            wide
          />
          )
        }
      </label>
      <Input
        fluid
        labeled
        {...props}
        label={false}
        type={props.type || 'text'}
        error={!!error}
        placeholder={(displayMode || readOnly) ? '' : placeHolder}
        onChange={props.changed}
      />
      {error
        && <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormLabelInput;
