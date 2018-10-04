/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FieldError } from '../../shared';

const FormInput = observer((props) => {
  const {
    label,
    error,
    tooltip,
    placeHolder,
    value,
  } = props.fielddata;
  const maxlength = props.fielddata.maxLength ? props.fielddata.maxLength : (
    props.maxLength ? props.maxLength : false
  );
  const { displayMode } = props;
  const fieldClass = `${props.containerclassname || ''} ${displayMode ? 'display-only' : ''}`;
  return (
    <Form.Field width={props.containerwidth || false} className={fieldClass} error={!!error}>
      {!props.ishidelabel && label !== '' &&
        <label>
          {props.label || label}
          {tooltip &&
            <Popup
              trigger={<Icon className="ns-help-circle" />}
              content={tooltip}
              position="top center"
              className="center-align"
              wide
            />
          }
          {props.removed &&
            <Link to={props.linkto} onClick={e => props.removed(e)}>
              <Icon className="ns-close-circle" color="grey" />
            </Link>
          }
        </label>
      }
      {props.type === 'password' &&
        <input style={{ opacity: 0, position: 'absolute' }} tabIndex={-1} value="something" />
      }
      <Input
        fluid
        {...props}
        value={value}
        autoComplete="nope"
        maxLength={maxlength || false}
        label={props.prefix || false}
        type={props.type || 'text'}
        placeholder={placeHolder}
        onChange={props.changed}
        readOnly={displayMode}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default FormInput;
