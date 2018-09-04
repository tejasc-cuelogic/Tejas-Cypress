/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, TextArea } from 'semantic-ui-react';
import { FieldError } from '../../shared';

const FormTextarea = observer((props) => {
  const {
    label,
    error,
    tooltip,
    placeHolder,
    value,
  } = props.fielddata;
  return (
    <Form.Field className={props.containerclassname || ''} error={!!error}>
      {!props.ishidelabel && label !== '' &&
        <label>
          {label}
          {tooltip &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={tooltip}
              position="top center"
              className="center-align"
              wide
            />
          }
        </label>
      }
      <TextArea
        {...props}
        value={value}
        label={label}
        placeholder={placeHolder}
        onChange={props.changed}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormTextarea;
