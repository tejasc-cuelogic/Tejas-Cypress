/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, TextArea } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

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
