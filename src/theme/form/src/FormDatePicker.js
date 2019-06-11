/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import NumberFormat from 'react-number-format';
import { FieldError } from '../../shared';

const FormDatePicker = observer(props => (
  <Form.Field width={props.containerwidth || false}>
    {props.fielddata ? (
      <label>
        {props.fielddata.label}
        {props.tooltip
            && (
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={props.tooltip}
              position="top center"
              className="center-align"
              wide
            />
            )
          }
      </label>
    ) : (null)}
    <DatePicker
      showMonthDropdown
      showYearDropdown
      {...props}
      label={false}
      dateFormat="MM/DD/YYYY"
      onClick={props.changed}
      customInput={<NumberFormat format="##/##/####" />}
      placeholderText={(props.displayMode || props.readOnly) ? '' : props.placeholder}
      onChange={props.changed}
      disabled={props.isdisabled}
      maxDate={props.maxdate}
      selected={props.selected}
    />
    {props.fielddata && props.fielddata.error
        && <FieldError error={props.fielddata.error} />
      }
  </Form.Field>
));

export default FormDatePicker;
