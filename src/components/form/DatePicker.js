/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import moment from 'moment';
import { Form } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';

const Date = props => (
  <Form.Field>
    <label>
      {props.label}
    </label>
    <DatePicker
      showMonthDropdown
      showYearDropdown
      placeholderText={props.placeholderText}
      dateFormat="MM-DD-YYYY"
      maxDate={moment()}
      selected={props.selected}
      onChange={props.changed}
      disabled={props.isdisabled}
    />
  </Form.Field>
);

export default Date;
