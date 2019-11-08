/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Dropdown } from 'semantic-ui-react';
import { FieldError } from '../../shared';
import { US_STATES } from '../../../constants/account';

const FormDropDown = observer((props) => {
  const {
    label,
    error,
    tooltip,
  } = props.fielddata;
  let {
    value,
  } = props.fielddata;
  const { displayMode, name, checkStateCode } = props;
  if (name === 'state' && checkStateCode) {
    const state = US_STATES.find(s => s.text === value.toUpperCase());
    value = state ? state.key : value;
  }
  const fieldClass = `${props.containerclassname || ''} ${displayMode ? ' display-only' : ''}`;
  return (
    <Form.Field error={error} width={props.containerwidth || false} className={fieldClass}>
      {!props.ishidelabel && label !== ''
        && (
          <label>
            {label}
            {(props.tooltip || tooltip)
              && (
                <Popup
                  trigger={<Icon className="ns-help-circle" />}
                  content={props.tooltip || tooltip}
                  position="top center"
                  className="center-align"
                  wide
                />
              )
            }
          </label>
        )
      }
      <Dropdown {...props} value={value} className={`${displayMode && 'readonly'}`} disabled={displayMode} />
      {!props.ishidelabel && label !== ''
        && <div className="dropdown-effect">{label}</div>
      }
      {error
        && <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormDropDown;
