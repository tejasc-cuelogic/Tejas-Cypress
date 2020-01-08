import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDropDown, MaskedInput } from '../index';
import { US_STATES } from '../../../constants/account';

@observer
class Address extends React.Component {
  render() {
    const { fielddata, changed, streetTwo, maskchanged, silblingElement, populateData } = this.props;
    return (
      <>
        <AutoComplete
          name="street"
          fielddata={fielddata.street}
          onplaceselected={place => populateData(place)}
          componentRestrictions={{ country: 'us' }}
          changed={changed}
        />
        {
          streetTwo
          && (
          <FormInput
            key="streetTwo"
            type="text"
            name="streetTwo"
            fielddata={fielddata.streetTwo}
            changed={changed}
            showerror
          />
          )
        }
        <Form.Group widths={2}>
          <FormInput
            key="city"
            name="city"
            fielddata={fielddata.city}
            changed={changed}
          />
          <FormDropDown
            name="state"
            fielddata={fielddata.state}
            options={US_STATES}
            search
            selection
            onChange={changed}
          />
          <MaskedInput
            key="zipCode"
            name="zipCode"
            format="#####"
            fielddata={fielddata.zipCode}
            changed={maskchanged}
          />
          {silblingElement}
        </Form.Group>
      </>
    );
  }
}

export default Address;
