/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Popup } from 'semantic-ui-react';

const FormRadioGroup = observer((props) => {
  const { values, value, tooltip } = props.fielddata;
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
                  trigger={<Icon name="help circle outline" />}
                  content={tooltip}
                  position="top center"
                  className="center-align"
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
