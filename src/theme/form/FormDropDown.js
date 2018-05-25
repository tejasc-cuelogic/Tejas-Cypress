/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Dropdown } from 'semantic-ui-react';
import FieldError from '../common/FieldError';


const FormDropDown = observer((props) => {
  const {
    label,
    error,
  } = props.fielddata;
  return (
    <Form.Field width={props.containerwidth || false} className={props.containerclassname || ''}>
      <label>
        {label}
        {props.tooltip &&
          <Popup
            trigger={<Icon name="help circle outline" />}
            content={props.tooltip}
            position="top center"
            className="center-align"
          />
        }
      </label>
      <Dropdown
        {...props}
      />
      <div className="dropdown-effect">{label}</div>
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormDropDown;
