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
    return (
      <Form.Field error={(!!error && this.state.showError) || (!!error && props.showerror)} className={props.containerclassname || ''}>
        <label>{label}</label>
        <Autocomplete
          {...props}
          onPlaceSelected={(place) => {
            props.onplaceselected(place);
          }}
          value={value}
          placeHolder={placeHolder}
          types={['address']}
          onChange={(e) => { props.changed(e); this.triggerError(props.showerror || false); }}
          onBlur={() => this.triggerError(true)}
        />
        {((error && this.state.showError) || (error && props.showerror)) &&
          <FieldError error={error} />
        }
      </Form.Field>
    );
  }
}
