import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { US_STATES } from '../../../../constants/account';
import { FormInput, FormSelect } from '../../../../components/form/FormElements';

@inject('entityAccountStore')
@observer
export default class General extends Component {
  render() {
    const { formGeneralInfo, genInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">General Information</Header>
        <Form error>
          <div className="field-wrap">
            <FormInput
              type="text"
              name="nameOfEntity"
              fielddata={formGeneralInfo.fields.nameOfEntity}
              changed={genInfoChange}
            />
            <FormInput
              type="text"
              name="taxId"
              fielddata={formGeneralInfo.fields.taxId}
              changed={genInfoChange}
            />
            <h5>Entity Address</h5>
            <FormInput
              type="text"
              name="street"
              fielddata={formGeneralInfo.fields.street}
              changed={genInfoChange}
            />
            <Form.Group widths="equal">
              <FormInput
                type="text"
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
                type="text"
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
