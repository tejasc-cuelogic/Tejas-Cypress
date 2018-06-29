import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { US_STATES } from '../../../../../../constants/account';
import { FormInput, FormSelect, AutoComplete, MaskedInput } from '../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class General extends Component {
  render() {
    const { formGeneralInfo, genInfoChange, setAddressFields } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">General Information</Header>
        <Form error>
          <div className="field-wrap">
            <FormInput
              name="name"
              fielddata={formGeneralInfo.fields.name}
              changed={genInfoChange}
            />
            <MaskedInput
              name="taxId"
              fielddata={formGeneralInfo.fields.taxId}
              mask="999-99-9999"
              changed={genInfoChange}
            />
            <h5>Entity Address</h5>
            <AutoComplete
              name="street"
              fielddata={formGeneralInfo.fields.street}
              onplaceselected={setAddressFields}
              changed={genInfoChange}
            />
            <Form.Group widths="equal">
              <FormInput
                name="city"
                fielddata={formGeneralInfo.fields.city}
                changed={genInfoChange}
              />
              <FormSelect
                name="state"
                fielddata={formGeneralInfo.fields.state}
                options={US_STATES}
                changed={genInfoChange}
              />
              <FormInput
                name="zipCode"
                fielddata={formGeneralInfo.fields.zipCode}
                changed={genInfoChange}
              />
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
