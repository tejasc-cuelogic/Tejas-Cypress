/*  eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { FieldError } from '../../shared';
import FormInput from './FormInput';

const FormColorPikcer = (props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [background, setBackground] = useState('#fff');

  useEffect(() => {
    setBackground(props.fieldData.value || '#fff');
  }, []);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  const { name, fieldData, changed, onblur } = props;

  return (
    <Form.Field width={props.containerwidth || false}>
      <FormInput
        name={name}
        key={name}
        type="text"
        format={get(fieldData, 'format')}
        fielddata={fieldData}
        onblur={onblur}
        changed={changed}
        label={get(props, 'label') || false}
        {...props}
      />
      <span><Button onClick={handleClick}>Pick Color</Button></span>
      {displayColorPicker ? (
        <ChromePicker
          color={background}
          onChange={handleChangeComplete}
        />
      ) : null}

      {props.fielddata && props.fielddata.error
        && <FieldError error={props.fielddata.error} />
      }
    </Form.Field>
  );
};

export default (observer(FormColorPikcer));
