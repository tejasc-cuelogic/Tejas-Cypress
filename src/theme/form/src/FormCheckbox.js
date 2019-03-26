/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Aux from 'react-aux';
import { Icon, Popup, List, Checkbox } from 'semantic-ui-react';

const FormCheckbox = observer((props) => {
  const {
    label, values, tooltip, value,
  } = props.fielddata;
  const {
    customLabel, conditionalCustomLabel, customUpdateLimitLabel, conditonalTooltip,
  } = props;
  return (
    <div className={props.containerclassname || false}>
      {
        values.map(c => (
          <List.Item className="ui checkbox">
            {props.defaults ? (
              <Checkbox
                checked={value ?
                  (Array.isArray(toJS(value)) ? value.includes(c.value) : c.value) : false}
                value={c.value}
                {...props}
                label={
                  <label>
                    {c.customLabel ? customLabel :
                      c.conditionalCustomLabel ? conditionalCustomLabel :
                        c.customUpdateLimitLabel ? customUpdateLimitLabel : c.label}
                    {conditonalTooltip ?
                      <Popup trigger={<Icon className="ns-help-circle" />} content={c.tooltip} position="top center" wide />
                      :
                      c.tooltip && (!conditonalTooltip && conditonalTooltip !== false) &&
                      <Popup trigger={<Icon className="ns-help-circle" />} content={c.tooltip} position="top center" wide />
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
                  {c.customLabel ? customLabel : c.label}
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
