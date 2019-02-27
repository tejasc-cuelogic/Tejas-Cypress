/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FieldError } from '../../shared';

@observer
export default class FormInput extends Component {
  state = { showError: false };
  triggerError = (val) => {
    this.setState({ showError: val });
  }
  render() {
    const { props } = this;
    const {
      label,
      error,
      tooltip,
      placeHolder,
      defaultValue,
      value,
    } = props.fielddata;
    const maxlength = props.fielddata.maxLength ? props.fielddata.maxLength : (
      props.maxLength ? props.maxLength : false
    );
    const { displayMode, readOnly, dataid } = props;
    const fieldClass = `${props.containerclassname || ''} ${displayMode ? ' display-only' : ''}`;
    return (
      <Form.Field
        width={props.containerwidth || false}
        className={fieldClass}
        error={(!!error && this.state.showError) || (!!error && props.showerror)}
      >
        {!props.ishidelabel && label !== '' &&
          <label>
            {props.label || label}
            {tooltip &&
              <Popup
                hoverable={props.hoverable}
                trigger={<Icon className="ns-help-circle" />}
                content={tooltip}
                position="top center"
                className={props.name === 'securitiesExemption' ? 'left-align' : 'center-align'}
                wide
              />
            }
            {props.removed &&
              <Link to={props.linkto || '/'} onClick={e => props.removed(e)}>
                <Icon className="ns-close-circle" color="grey" />
              </Link>
            }
          </label>
        }
        {props.type === 'password' &&
          <input style={{ opacity: 0, position: 'absolute', width: 0 }} tabIndex={-1} value="something" />
        }
        <Input
          fluid
          autoComplete="nope"
          maxLength={maxlength || false}
          type={props.type || 'text'}
          placeholder={(displayMode || readOnly) ? 'N/A' : placeHolder}
          defaultValue={defaultValue}
          onChange={
            (e) => {
              props.changed(e, { name: e.target.name, value: e.target.value, dataid });
              this.triggerError(props.showerror || false);
            }}
          onBlur={
            (e) => {
              this.triggerError(true);
              if (props.onblur) {
                this.props.onblur(e.target.value);
              }
            }
          }
          readOnly={displayMode}
          {...props}
          value={value === '' ? undefined : value}
          label={props.prefix || false}
        />
        {((error && this.state.showError) || (error && props.showerror)) &&
          <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
