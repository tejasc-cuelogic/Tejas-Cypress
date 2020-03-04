/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Select } from 'semantic-ui-react';
import { FieldError, PopUpModal } from '../../shared';

const isMobile = document.documentElement.clientWidth < 768;

const FormSelect = observer((props) => {
  const {
    label,
    value,
    error,
    placeHolder,
  } = props.fielddata;
  let width = '';
  if (props.containerwidth) {
    width = props.containerwidth;
  }
  const { displayMode, readOnly } = props;
  return (
    <Form.Field error={error} width={width}>
      <label>
        {props.tooltip
          ? (
            <PopUpModal
              customTrigger={<span className="popup-label">{label}</span>}
              content={props.tooltip}
              position="top center"
              className="center-align"
              wide
              showOnlyPopup={!isMobile}
            />
          ) : { label }
        }
      </label>
      <Select
        fluid
        {...props}
        value={value}
        error={!!error}
        onChange={props.changed}
        placeholder={(displayMode || readOnly) ? '' : placeHolder}
      />
      <div className="dropdown-effect">{props.fielddata.label}</div>
      {error
        && <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormSelect;
