/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import FieldError from '../common/FieldError';

const FormDatePicker = props => (
  <Form.Field>
    <label>
      {props.label}
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
      onClick={this.changed}
      onChange={this.changed}
    />
    {props.error &&
      <FieldError error={props.error} />
    }
  </Form.Field>
);

export default FormDatePicker;
