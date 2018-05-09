/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Form, Popup, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import FieldError from '../common/FieldError';

/* eslint-disable arrow-body-style */
const FormDatePicker = observer((props) => {
  const { label, error } = props.fielddata;
  return (
    <Form.Field>
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
      <DatePicker
        showMonthDropdown
        showYearDropdown
        {...props}
        label={false}
        dateFormat="MM-DD-YYYY"
        maxDate={moment()}
        onClick={props.changed}
        onChange={props.changed}
        disabled={props.isdisabled}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormDatePicker;
