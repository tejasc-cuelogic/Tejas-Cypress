/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Dropdown } from 'semantic-ui-react';
import { FieldError } from '../../shared';

const FormDropDown = observer((props) => {
  const {
    label,
    error,
    value,
    tooltip,
  } = props.fielddata;
  return (
    <Form.Field width={props.containerwidth || false} className={props.containerclassname || ''}>
      {!props.ishidelabel && label !== '' &&
        <label>
          {label}
          {(props.tooltip || tooltip) &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={props.tooltip || tooltip}
              position="top center"
              className="center-align"
              wide
            />
          }
        </label>
      }
      <Dropdown {...props} value={value} />
      <div className="dropdown-effect">{label}</div>
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormDropDown;
