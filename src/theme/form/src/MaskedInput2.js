/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
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
    <Form.Field error={!!error} className={props.containerclassname || ''}>
      <label>
        { !props.hidelabel && label}
        {tooltip &&
          <Popup
            trigger={<Icon name="help circle" />}
            content={tooltip}
            position="top center"
            className={props.containerClassname}
          />
        }
      </label>
      { props.action ? (
        <div className="ui action input">
          <InputMask
            {...props}
            value={value}
            format={props.format}
            onChange={props.changed}
            error={!!error}
            placeHolder={placeHolder}
            alwaysShowMask
            maskChar=" "
          />
          <Button
            className={props.actionclass}
            color={props.actioncolor}
            onClick={() => props.clickonaction()}
          >
            {props.actionlabel}
          </Button>
        </div>) : props.currency ? (
          <NumberFormat placeholder={placeHolder} maxLength={18} thousandSeparator {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : props.percentage ? (
        <NumberFormat placeholder={placeHolder} maxLength={4} {...props} value={value} onValueChange={props.changed} error={!!error} mask="%" suffix="%" />
      ) : props.phoneNumber ? (
        <NumberFormat type="tel" format={props.format} {...props} placeholder={placeHolder} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.zipCode ? (
        <NumberFormat format="#####" {...props} placeholder={placeHolder} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.ssn ? (
        <NumberFormat type="tel" format="###-##-####" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.dateOfBirth ? (
        <NumberFormat type="text" format="##/##/####" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.taxId ? (
        <NumberFormat type="text" format="##-#######" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.accountNumber ? (
        <NumberFormat
          isAllowed={(values) => {
              const accountNumber = values.value;
              if (accountNumber.toString().length <= 17) {
                return true;
              }
              return false;
            }
          }
          type="text"
          placeholder={placeHolder}
          {...props}
          value={value}
          onValueChange={values => props.changed(values, props.name)}
        />
      ) : props.routingNumber ? (
        <NumberFormat format="#########" type="text" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} />
      ) : <NumberFormat placeholder={placeHolder} format="(###)-###-####" {...props} value={value} onChange={props.changed} error={!!error} mask="_" />
      }
      {error && !props.showErrorOnField &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput2;
