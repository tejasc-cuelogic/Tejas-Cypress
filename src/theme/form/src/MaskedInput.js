/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button } from 'semantic-ui-react';
import { has } from 'lodash';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { FieldError } from '../../shared';

const NumberFormatWrapped = props => (
  <div className={props.wrapperClass}>
    <NumberFormat {...props} />
  </div>
);
@observer
export default class MaskedInput extends Component {
  state = { showError: false };
  triggerError = (val) => {
    this.setState({ showError: val });
  }
  render() {
    const { props } = this;
    const {
      label,
      error,
      value,
      tooltip,
      placeHolder,
    } = props.fielddata;
    const { displayMode, readOnly } = props;
    const fieldClass = `${props.containerclassname || ''} ${displayMode ? 'display-only' : ''}`;
    return (
      <Form.Field
        error={(!!error && this.state.showError) || (!!error && props.showerror)}
        className={fieldClass}
        width={props.containerwidth || false}
      >
        {!props.hidelabel &&
          <label>
            {props.label || label}
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
            {props.removed &&
              <Link to={props.linkto} onClick={e => props.removed(e)}>
                <Icon className="ns-close-circle" color="grey" />
              </Link>
            }
          </label>
        }
        {props.action ? (
          <div className="ui action input">
            <InputMask
              {...props}
              value={value}
              format={props.format}
              onChange={(e) => { props.changed(e); this.triggerError(props.showerror || false); }}
              onBlur={() => this.triggerError(true)}
              error={(!!error && this.state.showError) || (!!error && props.showerror)}
              placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder}
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
            <NumberFormatWrapped readOnly={displayMode} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} maxLength={props.maxlength || 15} thousandSeparator {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={props.onblur ? () => { props.onblur(); this.triggerError(true); } : () => this.triggerError(true)} onKeyPress={props.onkeypress ? () => { props.onkeypress(); this.triggerError(true); } : null} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" />
          ) : props.number ? (
            <NumberFormat readOnly={displayMode} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} maxLength={props.maxlength || 10} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" />
          ) : props.percentage ? (
            <NumberFormat readOnly={displayMode} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} maxLength={props.maxlength || 6} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="%" suffix="%" />
          ) : props.phoneNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format={props.format} {...props} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          ) : props.phoneNumberDisplayMode ? (
            <div className="ui huge fluid input">
              <NumberFormat readOnly={displayMode} type="tel" format={props.format} {...props} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
            </div>
          ) : props.zipCode ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#####" {...props} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          ) : props.ssn ? (
            <NumberFormat readOnly={displayMode} type="tel" format="###-##-####" placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          ) : props.dateOfBirth ? (
            <div className="calender-icon">
              <NumberFormat readOnly={displayMode} type="text" format={props.format ? props.format : '##/##/####'} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
            </div>
          ) : props.taxId ? (
            <NumberFormat readOnly={displayMode} type="tel" format="##-#######" placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          ) : props.accountNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#################" placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} {...props} value={has(props, 'value') ? props.value : value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} />
          ) : props.routingNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#########" placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} {...props} value={has(props, 'value') ? props.value : value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} />
          ) : <NumberFormat readOnly={displayMode} placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder} format="(###) ###-####" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" />
        }
        {((error && this.state.showError && !props.showErrorOnField) ||
        (error && props.showerror && !props.showErrorOnField))
         &&
         <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
