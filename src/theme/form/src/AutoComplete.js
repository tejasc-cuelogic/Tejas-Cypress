/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import Autocomplete from 'react-google-autocomplete';
import { FieldError } from '../../shared';

const AutoComplete = observer((props) => {
  const {
    label, error, value, placeholder,
  } = props.fielddata;
  return (
    <Form.Field error={error}>
      <label>{label}</label>
      <Autocomplete
        {...props}
        onPlaceSelected={(place) => {
          props.onplaceselected(place);
        }}
        value={value}
        placeholder={placeholder}
        types={['address']}
        onChange={props.changed}
      />
      {error &&
        <FieldError error={error} />
      }
    </Form.Field>
  );
});

export default AutoComplete;
