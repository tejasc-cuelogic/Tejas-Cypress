/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import Autocomplete from 'react-google-autocomplete';

const AutoComplete = observer((props) => {
  const {
    placeHolder,
    value,
  } = props.fielddata;
  return (
    <Autocomplete
      {...props}
      onPlaceSelected={(place) => {
        props.onplaceselected(place);
      }}
      types={['address']}
      placeholder={placeHolder}
      value={value}
      onChange={props.changed}
    />
  );
});

export default AutoComplete;
