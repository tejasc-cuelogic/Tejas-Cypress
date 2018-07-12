import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { US_STATES } from '../../../../../../../constants/account';
import { FormInput, MaskedInput2, FormSelect, AutoComplete, MaskedInput } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class General extends Component {
  render() {
    const { GEN_INFO_FRM, genInfoChange, setAddressFields } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">General Information</Header>
        <Form error>
          <div className="field-wrap">
            <FormInput
              name="name"
              fielddata={GEN_INFO_FRM.fields.name}
              changed={genInfoChange}
            />
            <MaskedInput
              name="taxId"
              fielddata={GEN_INFO_FRM.fields.taxId}
              mask="999-99-9999"
              changed={genInfoChange}
            />
            <h5>Entity Address</h5>
            <AutoComplete
              name="street"
              fielddata={GEN_INFO_FRM.fields.street}
              onplaceselected={setAddressFields}
              changed={genInfoChange}
            />
            <Form.Group widths="equal">
              <FormInput
                name="city"
                fielddata={GEN_INFO_FRM.fields.city}
                changed={genInfoChange}
              />
              <FormSelect
                name="state"
                fielddata={GEN_INFO_FRM.fields.state}
                options={US_STATES}
                changed={genInfoChange}
              />
              <MaskedInput2
                name="zipCode"
                fielddata={GEN_INFO_FRM.fields.zipCode}
                changed={genInfoChange}
                zipCode
              />
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
