/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { FieldError } from '../../shared';

const MaskedInput2 = observer((props) => {
  const {
    label,
    error,
    value,
    placeHolder,
  } = props.fielddata;
  return (
    <Form.Field error={!!error}>
      <label>
        {label}
        {props.tooltip &&
          <Popup
            trigger={<Icon name="help circle" />}
            content={props.tooltip}
            position="top center"
            className="center-align"
          />
        }
      </label>
      {props.currency ? (
        <NumberFormat placeholder={placeHolder} maxLength={18} thousandSeparator {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : props.number ? (
        <NumberFormat placeholder={placeHolder} maxLength={18} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : props.percentage ? (
        <NumberFormat placeholder={placeHolder} maxLength={4} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="%" suffix="%" />
      ) : props.ssn ? (
        <NumberFormat placeholder={placeHolder} maxLength={12} format="###-##-####" {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : (
        <NumberFormat placeholder={placeHolder} format="(###)-###-####" {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      )
      }
      {error && !props.showErrorOnField &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput2;
