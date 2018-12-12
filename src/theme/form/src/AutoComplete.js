/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import Autocomplete from 'react-google-autocomplete';
import { FieldError } from '../../shared';
@observer
export default class AutoComplete extends Component {
  state = { showError: false };
  triggerError = (val) => {
    this.setState({ showError: val });
  }
  render() {
    const { props } = this;
    const {
      label, error, value, placeHolder,
    } = props.fielddata;
    const { displayMode, readOnly } = props;
    const classes = `${props.containerclassname || ''} ${props.readOnly ? 'display-only' : ''}`;
    return (
      <Form.Field
        error={(!!error && this.state.showError) || (!!error && props.showerror)}
        className={classes}
      >
        <label>{label}</label>
        {props.readOnly ?
          <p className="address-line">{value}</p> :
          <Autocomplete
            {...props}
            onPlaceSelected={(place) => {
              props.onplaceselected(place);
            }}
            value={value}
            placeholder={(displayMode || readOnly) ? '' : placeHolder}
            types={['address']}
            onChange={(e) => { props.changed(e); this.triggerError(props.showerror || false); }}
            onBlur={() => this.triggerError(true)}
          />
        }
        {((error && this.state.showError) || (error && props.showerror)) &&
          <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
