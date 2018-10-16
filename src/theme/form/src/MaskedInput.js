/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import { FieldError } from '../../shared';

const MaskedInput = observer((props) => {
  const {
    label,
    error,
    value,
    tooltip,
    placeHolder,
  } = props.fielddata;
  const { displayMode } = props;
  const fieldClass = `${props.containerclassname || ''} ${displayMode ? 'display-only' : ''}`;
  return (
    <Form.Field error={!!error} className={fieldClass}>
      <label>
        { !props.hidelabel && label}
        {tooltip &&
          <Popup
            hoverable={props.hoverable}
            trigger={<Icon className="ns-help-circle" />}
            // content={tooltip}
            position="top center"
            className={props.containerClassname}
            wide
          >
            <Popup.Content>
              {tooltip}
            </Popup.Content>
          </Popup>
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
          <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 15} thousandSeparator {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : props.number ? (
        <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 10} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      ) : props.percentage ? (
        <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 4} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="%" suffix="%" />
      ) : props.phoneNumber ? (
        <NumberFormat readOnly={displayMode} type="tel" format={props.format} {...props} placeholder={placeHolder} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.zipCode ? (
        <NumberFormat readOnly={displayMode} type="tel" format="#####" {...props} placeholder={placeHolder} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.ssn ? (
        <NumberFormat readOnly={displayMode} type="tel" format="###-##-####" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.dateOfBirth ? (
        <NumberFormat readOnly={displayMode} type="text" format={props.format ? props.format : '##/##/####'} placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.taxId ? (
        <NumberFormat readOnly={displayMode} type="tel" format="##-#######" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} />
      ) : props.accountNumber ? (
        <NumberFormat readOnly={displayMode} type="tel" format="#################" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} />
      ) : props.routingNumber ? (
        <NumberFormat readOnly={displayMode} type="tel" format="#########" placeholder={placeHolder} {...props} value={value} onValueChange={values => props.changed(values, props.name)} />
      ) : <NumberFormat readOnly={displayMode} placeholder={placeHolder} format="(###)-###-####" {...props} value={value} onValueChange={values => props.changed(values, props.name)} error={!!error} mask="_" />
      }
      {error && !props.showErrorOnField &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput;
