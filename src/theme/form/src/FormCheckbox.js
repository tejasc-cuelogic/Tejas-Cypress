/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { includes } from 'lodash';
import { Icon, Popup, List, Checkbox } from 'semantic-ui-react';
import { PopUpModal } from '../../shared';

const isMobile = document.documentElement.clientWidth < 768;

const FormCheckbox = observer((props) => {
  const {
    values, value,
  } = props.fielddata;
  const {
    customLabel, conditionalCustomLabel, customUpdateLimitLabel, customRegulationLabel,
    tooltipHardDisable, currentInvestmentStatus, label,
  } = props;
  return (
    <div className={props.containerclassname || false}>
      {label ? <label>{label}</label> : null}
      {
        values.map(c => (
          <List.Item className="ui checkbox">
            {props.defaults ? (
              <Checkbox
                checked={value
                  ? (Array.isArray(toJS(value)) ? value.includes(c.value) : c.value) : false}
                value={c.value}
                {...props}
                label={(
                  <label>
                    {c.customLabel ? customLabel
                      : c.conditionalCustomLabel ? conditionalCustomLabel
                        : c.customUpdateLimitLabel ? customUpdateLimitLabel
                          : c.customRegulationLabel ? customRegulationLabel : c.label}
                    {c.value === '4' && c.tooltip && !tooltipHardDisable && !includes(['BD_506C', 'BD_506B'], currentInvestmentStatus)
                      ? <Popup trigger={<Icon className="ns-help-circle" />} content={c.tooltip} position="top center" wide />
                      : c.tooltip && !tooltipHardDisable && !includes(['BD_506C', 'BD_506B'], currentInvestmentStatus)
                      && <Popup trigger={<Icon className="ns-help-circle" />} content={c.tooltip} position="top center" wide />
                    }
                  </label>
                )}
                onChange={props.changed}
              />
            ) : (
              <>
                <input type="checkbox" readOnly checked={value.includes(c.value)} value={c.value} onChange={props.changed} {...props} />
                <label>
                  {c.icon
                  && <Icon className={c.icon} />
                    }
                  {c.tooltip
                  ? (
                    <PopUpModal
                      customTrigger={<span className="popup-label">{c.customLabel ? customLabel : c.label}</span>}
                      content="test"
                      position="top center"
                      className="center-align"
                      wide
                      showOnlyPopup={!isMobile}
                    />
                  )
                  : <span>{c.customLabel ? customLabel : c.label}</span>
                  }
                </label>
              </>
            //   <Checkbox
            //     checked={value.includes(c.value)}
            //     value={c.value}
            //     onChange={props.changed}
            //     {...props}
            //     label={(
            //       <label>
            //       {c.icon
            //       && <Icon className={c.icon} />
            //         }
            //       {c.tooltip
            //       ? (
            //         <PopUpModal
            //           customTrigger={<span className="popup-label">{c.customLabel ? customLabel : c.label}</span>}
            //           content={c.tooltip}
            //           position="top center"
            //           className="center-align"
            //           wide
            //           showOnlyPopup={!isMobile}
            //         />
            //       )
            //       : <span>{c.customLabel ? customLabel : c.label}</span>
            //       }
            //     </label>
            //     )}
            //   />
            // )
            }
          </List.Item>
        ))
      }
    </div>
  );
});

export default FormCheckbox;
