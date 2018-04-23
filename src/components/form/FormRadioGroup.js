/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';

const FormRadioGroup = observer((props) => {
  const { values, value } = props.fielddata;
  return (
    <Form.Group inline className="button-radio center-align">
      {
        values.map(radio => (
          <Form.Radio
            key={radio.label}
            {...props}
            label={radio.label}
            value={radio.value}
            className={`${props.value} ${radio.value}`}
            checked={value === radio.value}
            onChange={props.changed}
          />
        ))
      }
    </Form.Group>
  );
});

export default FormRadioGroup;
