/*  eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
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

  useEffect(() => {
    setBackground(props.fieldData.value || '#fff');
  }, [props.fieldData.value]);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChangeComplete = (color, e) => {
    const { name } = props;
    setBackground(color.hex);
    props.changed(e, { name, value: color.hex });
  };

  const { name, fieldData, changed, onblur } = props;
  // const pickerElement = colorPikcer[pickerType || 'ChromePicker'];

  const styles = {
    color: {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: `${background}`,
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
  };

  return (
    <Form.Field width={props.containerwidth || false} className="pos-relative header-bg">
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
      {fieldData.value && fieldData.value !== ''
        ? (
          <Button className="btn-color-picker" style={styles.swatch} onClick={handleClick}>
            <div style={styles.color} />
          </Button>
        )
        : (
          <span>
            <Button onClick={handleClick} className="btn-color-picker">
              <i aria-hidden="true" className="eyedropper icon" />
            </Button>
          </span>
        )
      }
      {
        displayColorPicker ? (
          <SketchPicker
            color={background}
            onChange={handleChangeComplete}
          />
        ) : null
      }
      {
        props.fielddata && props.fielddata.error
        && <FieldError error={props.fielddata.error} />
      }
    </Form.Field>
  );
};

export default (observer(FormColorPikcer));
