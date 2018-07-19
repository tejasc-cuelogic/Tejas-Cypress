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
    tooltip,
    placeHolder,
  } = props.fielddata;
  return (
    <Form.Field error={!!error}>
      <label>
        {label}
        {tooltip &&
          <Popup
            trigger={<Icon name="help circle outline" />}
            content={tooltip}
            position="top center"
            className={props.containerClassname}
          />
        }
      </label>
      {props.currency ? (
        <NumberFormat placeholder={placeHolder} maxLength={18} thousandSeparator {...props} value={value} onValueChange={props.changed} error={!!error} mask="_" />
      ) : props.percentage ? (
        <NumberFormat placeholder={placeHolder} maxLength={4} {...props} value={value} onValueChange={props.changed} error={!!error} mask="%" suffix="%" />
      ) : props.phoneNumber ? (
        <NumberFormat type="tel" format={props.format} {...props} placeholder={placeHolder} value={value} onChange={props.changed} error={!!error} />
      ) : props.zipCode ? (
        <NumberFormat format="#####" {...props} placeholder={placeHolder} value={value} onChange={props.changed} error={!!error} />
      ) : props.ssn ? (
        <NumberFormat type="tel" format="###-##-####" placeholder={placeHolder} {...props} value={value} onChange={props.changed} error={!!error} />
      ) : props.taxId ? (
        <NumberFormat type="text" format="##-#######" placeholder={placeHolder} {...props} value={value} onChange={props.changed} error={!!error} />
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
