import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import FormInput from '../../../../components/form/FormInput';

@inject('entityAccountStore')
@observer
export default class General extends Component {
  render() {
    const { formGeneralInfo, onFieldChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">General Information</Header>
        <Form error>
          <div className="field-wrap">
            <FormInput
              type="text"
              name="nameOfEntity"
              label={formGeneralInfo.fields.nameOfEntity.label}
              value={formGeneralInfo.fields.nameOfEntity.value}
              error={formGeneralInfo.fields.nameOfEntity.error}
              placeholder="e.g. Pad Wealth"
              changed={onFieldChange}
            />
            <FormInput
              type="text"
              name="taxId"
              label={formGeneralInfo.fields.taxId.label}
              value={formGeneralInfo.fields.taxId.value}
              error={formGeneralInfo.fields.taxId.error}
              placeholder="e.g. 12345"
              changed={onFieldChange}
            />
            <h5>Entity Address</h5>
            <FormInput
              type="text"
              name="street"
              label={formGeneralInfo.fields.street.label}
              value={formGeneralInfo.fields.street.value}
              error={formGeneralInfo.fields.street.error}
              changed={onFieldChange}
            />
            <Form.Group widths="equal">
              <FormInput
                type="text"
                name="city"
                label={formGeneralInfo.fields.city.label}
                value={formGeneralInfo.fields.city.value}
                error={formGeneralInfo.fields.city.error}
                changed={onFieldChange}
              />
              <FormInput
                type="text"
                name="zipCode"
                label={formGeneralInfo.fields.zipCode.label}
                value={formGeneralInfo.fields.zipCode.value}
                error={formGeneralInfo.fields.zipCode.error}
                changed={onFieldChange}
              />
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
