/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import FieldError from '../common/FieldError';

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
            className="center-align"
          />
        }
      </label>
      {props.isCurrency ? (
        <NumberFormat placeholder={placeHolder} maxLength={18} thousandSeparator {...props} value={value} onChange={props.changed} error={!!error} mask="_" />
      ) : (
        <NumberFormat format="(###)-###-####" {...props} value={value} onChange={props.changed} error={!!error} mask="_" />
      )
      }
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput2;
