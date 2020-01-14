/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Select } from 'semantic-ui-react';
import { FieldError } from '../../shared';

const FormSelect = observer((props) => {
  const {
    label,
    value,
    error,
    placeHolder,
  } = props.fielddata;
  let width = false;
  if (props.containerwidth) {
    width = props.containerwidth;
  }
  const { displayMode, readOnly } = props;
  const fieldClass = `${props.containerclassname || ''} ${displayMode ? ' display-only' : ''}`;
  return (
    <Form.Field error={error} width={width} className={fieldClass}>
      <label>
        {label}
        {props.tooltip
          && (
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={props.tooltip}
              position="top center"
              className="center-align"
              wide
            />
          )
        }
      </label>
      <Select
        fluid
        {...props}
        value={value}
        error={!!error}
        onChange={props.changed}
        placeholder={(displayMode || readOnly) ? '' : placeHolder}
        disabled={displayMode}
      />
      <div className="dropdown-effect">{props.fielddata.label}</div>
      {error
        && <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormSelect;
