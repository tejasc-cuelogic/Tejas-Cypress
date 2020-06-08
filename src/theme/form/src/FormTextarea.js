/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Popup, Icon, TextArea } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FieldError } from '../../shared';

@observer
export default class FormTextarea extends Component {
  state = { showError: false };

  constructor(props) {
    super(props);
    if (this.props.defaultValue && (this.props.fielddata.value === '' || this.props.fielddata.value === undefined)) {
      this.props.changed({}, { name: this.props.name, value: this.props.defaultValue });
    }
  }

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
    const { displayMode, readOnly } = props;
    const classes = `${props.containerclassname || ''} ${props.readOnly ? 'display-only' : ''}`;
    return (
      <Form.Field className={classes} error={(!!error && this.state.showError)}>
        {!props.hidelabel && label !== ''
          && (
            <label>
              {props.label || label}
              {tooltip
                && (
                  <Popup
                    trigger={<Icon className="ns-help-circle" />}
                    content={tooltip}
                    position="top center"
                    className="center-align"
                    wide
                  />
                )
              }
              {props.removed
                && (
                  <Link to={props.linkto} onClick={e => props.removed(e)}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                )
              }
            </label>
          )
        }
        {props.readOnly
          ? <p className={value ? 'commet-area' : 'not-applicable'}>{value || 'N/A'}</p>
          : (
            <TextArea
              value={value === '' ? props.clear ? '' : undefined : value}
              label={label}
              placeholder={(displayMode || readOnly) ? '' : placeHolder}
              defaultValue={props.defaultValue ? props.defaultValue : defaultValue}
              onChange={(e) => {
                props.changed(e, { name: e.target.name, value: e.target.value });
                this.triggerError(false);
              }}
              onBlur={() => this.triggerError(true)}
              {...props}
            />
          )
        }
        {error && this.state.showError
          && <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
