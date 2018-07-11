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
    <Form.Field>
      <label>
        {label}
        {props.tooltip &&
          <Popup
            trigger={<Icon name="help circle outline" />}
            content={props.tooltip}
            position="top center"
            className={props.containerClassname}
          />
        }
      </label>
      {props.currency &&
        <NumberFormat
          placeholder={placeHolder}
          maxLength={18}
          thousandSeparator
          {...props}
          value={value}
          onChange={props.changed}
          error={!!error}
        />
      }
      {props.phoneNumber &&
        <NumberFormat type="tel" format="(###)-###-####" {...props} value={value} onChange={props.changed} error={!!error} />
      }
      {props.businessZipCode &&
        <NumberFormat format="#####" {...props} value={value} onChange={props.changed} error={!!error} />
      }
      {props.zipCode &&
        <NumberFormat format="#####" {...props} value={value} onChange={props.changed} error={!!error} />
      }
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput2;
