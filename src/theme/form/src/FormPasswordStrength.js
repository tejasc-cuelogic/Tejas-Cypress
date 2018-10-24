/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactPasswordStrength from 'react-password-strength';
import { FieldError } from '../../shared';
@inject('authStore')
@observer
export default class FormPasswordStrength extends Component {
  state = { showError: false };
  triggerError = (val) => {
    this.setState({ showError: val });
  }
  render() {
    const { props } = this;
    const {
      togglePasswordType,
    } = this.props.authStore;
    const {
      label,
      error,
      tooltip,
    } = props.fielddata;
    // const maxlength = props.fielddata.maxLength ? props.fielddata.maxLength : (
    //   props.maxLength ? props.maxLength : false
    // );
    const { displayMode } = props;
    const fieldClass = `${props.containerclassname || ''} ${displayMode ? ' display-only' : ''}`;
    return (
      <Form.Field
        width={props.containerwidth || false}
        className={fieldClass}
        error={(!!error && this.state.showError)}
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
                className="center-align"
                wide
              />
            }
            {props.removed &&
              <Link to={props.linkto} onClick={e => props.removed(e)}>
                <Icon className="ns-close-circle" color="grey" />
              </Link>
            }
          </label>
        }
        {props.type === 'password' &&
          <input style={{ opacity: 0, position: 'absolute', width: 0 }} tabIndex={-1} value="something" />
        }
        <ReactPasswordStrength
          key={props.key}
          className="ui input"
          minLength={props.minLength}
          minScore={props.minScore}
          tooShortWord={props.tooShortWord}
          scoreWords={props.scoreWords}
          inputProps={props.inputProps}
          changeCallback={(e) => { props.changed(e); this.triggerError(false); }}
          onBlur={() => this.triggerError(true)}
        />
        <Icon className="ns-view" onClick={togglePasswordType()} />
        {error && this.state.showError &&
          <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
