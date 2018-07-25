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
        <NumberFormat placeholder={placeHolder} maxLength={18} thousandSeparator {...props} value={value} onChange={props.changed} error={!!error} mask="_" />
      ) : props.percentage ? (
        <NumberFormat placeholder={placeHolder} maxLength={4} {...props} value={value} onValueChange={props.changed} error={!!error} mask="%" suffix="%" />
      ) : (
        <NumberFormat placeholder={placeHolder} format="(###)-###-####" {...props} value={value} onChange={props.changed} error={!!error} mask="_" />
      )
      }
      {error && !props.showErrorOnField &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput2;
