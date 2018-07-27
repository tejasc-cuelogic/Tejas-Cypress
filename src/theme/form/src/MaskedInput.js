/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import { FieldError } from '../../shared';

const MaskedInput = observer((props) => {
  const { label, error, value } = props.fielddata;
  return (
    <Form.Field error={!!error}>
      <label>
        {!props.hidelabel && label}
        {props.tooltip &&
          <Popup
            trigger={<Icon name="help circle" />}
            content={props.tooltip}
            position="top center"
            className="center-align"
          />
        }
      </label>
      {props.action ?
        <div className="ui action input">
          <InputMask
            {...props}
            value={value}
            onChange={props.changed}
            error={!!error}
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
        </div> :
        <InputMask
          {...props}
          value={value}
          onChange={props.changed}
          error={!!error}
          alwaysShowMask
          maskChar=" "
        />
      }
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default MaskedInput;
