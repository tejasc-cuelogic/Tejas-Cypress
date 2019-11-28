/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Button, Modal, Header } from 'semantic-ui-react';
import { has } from 'lodash';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { FieldError } from '../../shared';

const isMobile = document.documentElement.clientWidth < 768;
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
    const { displayMode, readOnly, allowNegative } = props;
    const commonProps = {
      readOnly: displayMode,
      allowNegative: allowNegative || false,
      placeholder: (displayMode || readOnly) ? 'N/A' : placeHolder,
    };
    const fieldClass = `${props.containerclassname || ''} ${displayMode ? 'display-only' : ''}`;
    const CustomToolTip = ({ trigger }) => (
      <>
      {isMobile ? (
        <Modal style={{ top: '50%', transform: 'translate(0, -50%)' }} size="tiny" trigger={trigger} closeIcon>
          <Modal.Content>
            <Header as="h5">
              {label}
            </Header>
            <span>{tooltip}</span>
          </Modal.Content>
        </Modal>
      )
        : (
        <Popup
          on={props.toolTipOnLabel ? 'click' : 'hover'}
          hoverable={props.toolTipOnLabel ? false : props.hoverable}
          trigger={trigger}
          position={isMobile ? 'bottom center' : 'top center'}
          className={props.containerClassname}
          wide
        >
          <Popup.Content>
            {tooltip}
          </Popup.Content>
        </Popup>
        )
    }
    {props.removed
      && (
        <Link to={props.linkto} onClick={e => props.removed(e)}>
          <Icon className="ns-close-circle" color="grey" />
        </Link>
      )
    }
    </>
    );
    const fieldLabel = (props.label
      && (props.asterisk && props.asterisk === 'true'
        ? `${props.label}*` : props.label))
        || (props.asterisk && props.asterisk === 'true' ? `${label}*` : label);
    return (
      <Form.Field
        error={(!!error && this.state.showError) || (!!error && props.showerror)}
        className={fieldClass}
        width={props.containerwidth || false}
      >

        {!props.hidelabel
          && (
            <label className={props.toolTipOnLabel ? 'dotted-tooltip' : ''}>
              {props.toolTipOnLabel ? <CustomToolTip trigger={<span>{fieldLabel}</span>} /> : fieldLabel}
              {!props.toolTipOnLabel && tooltip
                && (
                  <>
                  <CustomToolTip trigger={<Icon className="ns-help-circle" />} />
                </>
                )}
            </label>
          )
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
          </div>
        ) : props.currency ? (
          <NumberFormatWrapped {...commonProps} maxLength={props.maxlength || 15} thousandSeparator {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={props.onblur ? () => { props.onblur(); this.triggerError(true); } : () => this.triggerError(true)} onKeyUp={props.onkeyup ? () => { props.onkeyup(); this.triggerError(props.showerror || false); } : null} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" decimalScale={props.disableDecimal ? 0 : 2} />
        ) : props.number ? (
          <NumberFormat {...commonProps} maxLength={props.maxlength || 10} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" decimalScale={0} />
        ) : props.percentage ? (
          <NumberFormat {...commonProps} maxLength={props.maxlength || 6} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="%" suffix="%" />
        ) : props.phoneNumber ? (
          <NumberFormat {...commonProps} type="tel" format={props.format} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
        ) : props.phoneNumberDisplayMode ? (
          <div className="ui huge fluid input">
            <NumberFormat {...commonProps} type="tel" format={props.format} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          </div>
        ) : props.zipCode ? (
          <NumberFormat {...commonProps} type="tel" format="#####" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
        ) : props.ssn ? (
          <NumberFormat className="fs-block" {...commonProps} type="tel" format="###-##-####" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
        ) : props.dateOfBirth ? (
          <div className="calender-i con">
            <NumberFormat {...commonProps} type="text" format={props.format ? props.format : '##/##/####'} {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
          </div>
        ) : props.taxId ? (
          <NumberFormat {...commonProps} type="tel" format="##-#######" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} />
        ) : props.accountNumber ? (
          <NumberFormat {...commonProps} type="tel" format="#################" {...props} value={has(props, 'value') ? props.value : value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} />
        ) : props.routingNumber ? (
          <NumberFormat {...commonProps} type="tel" format="#########" {...props} value={has(props, 'value') ? props.value : value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} />
        ) : <NumberFormat {...commonProps} format="(###) ###-####" {...props} value={value} onValueChange={(values) => { props.changed(values, props.name); this.triggerError(props.showerror || false); }} onBlur={() => this.triggerError(true)} error={(!!error && this.state.showError) || (!!error && props.showerror)} mask="_" />
        }
        {((error && this.state.showError && !props.showErrorOnField)
          || (error && props.showerror && !props.showErrorOnField))
          && <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
