/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import Aux from 'react-aux';
import { Icon, Popup, Form } from 'semantic-ui-react';
import { FieldError } from '../../shared';

const FormRadioGroup = observer((props) => {
  const {
    values, value, tooltip, error,
  } = props.fielddata;

  if (!props.iconic) {
    if (props.vertical) {
      return (
        <div className={props.containerclassname || false}>
          {
            values.map(radio => (
              <Form.Radio
                key={radio.label}
                {...props}
                error={error}
                label={radio.label}
                value={radio.value}
                className={`${props.value} ${radio.value}`}
                checked={value === radio.value}
                onChange={props.changed}
              />
            ))
          }
        </div>
      );
    } else if (props.withtooltip) {
      return (
        <div className={props.containerclassname || false}>
          <Form.Group className="vertical">
            {
              values.map(radio => (
                <Form.Field>
                  <div className={`ui radio checkbox ${value === radio.value ? 'checked' : ''}`}>
                    <input type="radio" value={radio.value} checked={value === radio.value} onChange={props.changed} {...props} />
                    <label>
                      {radio.icon &&
                        <Icon className={radio.icon} />
                      }
                      {radio.label}
                      {radio.tooltip &&
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content={radio.tooltip}
                          position="top center"
                          className="center-align"
                          wide
                        />
                      }
                    </label>
                  </div>
                </Form.Field>
              ))
            }
          </Form.Group>
        </div>
      );
    }
    return (
      <Aux>
        <Form.Group widths={props.widths} inline className={props.containerclassname || false}>
          {
            values.map(radio => (
              <Form.Radio
                key={radio.label}
                {...props}
                error={error}
                label={radio.label}
                value={radio.value}
                className={`${props.value} ${radio.value}`}
                checked={value === radio.value}
                onChange={props.changed}
              />
            ))
          }
        </Form.Group>
        {error && props.showerror &&
          <FieldError className={props.classname || false} error={error} />
        }
      </Aux>
    );
  }

  return (
    <div className={props.containerclassname || false}>
      {
        values.map(radio => (
          <div className={`ui radio checkbox ${value === radio.value ? 'checked' : ''}`}>
            <input type="radio" readOnly value={radio.value} checked={value === radio.value} onChange={props.changed} {...props} />
            <label>
              {radio.icon &&
                <Icon className={radio.icon} />
              }
              {radio.label}
              {tooltip &&
                <Popup
                  trigger={<Icon className="ns-help-circle" />}
                  content={tooltip}
                  position="top center"
                  className="center-align"
                  wide
                />
              }
            </label>
          </div>
        ))
      }
    </div>
  );
});

export default FormRadioGroup;
