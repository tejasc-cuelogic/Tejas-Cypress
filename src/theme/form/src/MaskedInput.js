/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import { FieldError } from '../../shared';

// const MaskedInput = observer((props) => {
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
    const { displayMode } = props;
    const fieldClass = `${props.containerclassname || ''} ${displayMode ? 'display-only' : ''}`;
    return (
      <Form.Field error={(!!error && this.state.showError)} className={fieldClass}>
        <label>
          {!props.hidelabel && (props.label || label)}
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
        </label>
        {props.action ? (
          <div className="ui action input">
            <InputMask
              {...props}
              value={value}
              format={props.format}
              onChange={(e) => { props.changed(e); this.triggerError(false); }}
              onBlur={() => this.triggerError(true)}
              error={(!!error && this.state.showError)}
              placeHolder={placeHolder}
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
            <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 15} thousandSeparator {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} mask="_" />
          ) : props.number ? (
            <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 10} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} mask="_" />
          ) : props.percentage ? (
            <NumberFormat readOnly={displayMode} placeholder={placeHolder} maxLength={props.maxlength || 4} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} mask="%" suffix="%" />
          ) : props.phoneNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format={props.format} {...props} placeholder={placeHolder} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} />
          ) : props.zipCode ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#####" {...props} placeholder={placeHolder} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} />
          ) : props.ssn ? (
            <NumberFormat readOnly={displayMode} type="tel" format="###-##-####" placeholder={placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} />
          ) : props.dateOfBirth ? (
            <NumberFormat readOnly={displayMode} type="text" format={props.format ? props.format : '##/##/####'} placeholder={placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} />
          ) : props.taxId ? (
            <NumberFormat readOnly={displayMode} type="tel" format="##-#######" placeholder={placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} />
          ) : props.accountNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#################" placeholder={placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} />
          ) : props.routingNumber ? (
            <NumberFormat readOnly={displayMode} type="tel" format="#########" placeholder={placeHolder} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} />
          ) : <NumberFormat readOnly={displayMode} placeholder={placeHolder} format="(###)-###-####" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError)} mask="_" />
        }
        {error && this.state.showError && !props.showErrorOnField &&
          <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
