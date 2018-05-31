/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import Aux from 'react-aux';
import { Icon, Popup, List, Checkbox } from 'semantic-ui-react';

const FormCheckbox = observer((props) => {
  const {
    label, values, tooltip, value,
  } = props.fielddata;
  return (
    <div className={props.containerclassname || false}>
      {
        values.map(c => (
          <List.Item className="ui checkbox">
            {props.defaults ? (
              <Checkbox
                checked={value.includes(c.value)}
                value={c.value}
                {...props}
                label={
                  <label>{c.label}
                    {c.tooltip &&
                      <Popup trigger={<Icon name="help circle outline" />} content={c.tooltip} position="top center" />
                    }
                  </label>
                }
                onChange={props.changed}
              />
            ) : (
              <Aux>
                <input type="checkbox" readOnly checked={value.includes(c.value)} value={c.value} onChange={props.changed} {...props} />
                <label>
                  {c.icon &&
                    <Icon className={c.icon} />
                  }
                  {c.label}
                  {tooltip &&
                    <Popup
                      trigger={<Icon name="help circle outline" />}
                      content={tooltip}
                      position="top center"
                      className="center-align"
                    />
                  }
                </label>
              </Aux>
            )
            }
          </List.Item>
        ))
      }
    </div>
  );
});

export default FormCheckbox;
