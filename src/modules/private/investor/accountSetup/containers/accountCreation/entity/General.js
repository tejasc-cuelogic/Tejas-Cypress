import React, { Component } from 'react';
import { Header, Form, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { US_STATES_FOR_INVESTOR, ENTITY_TYPES } from '../../../../../../../constants/account';
import { ListErrors } from '../../../../../../../theme/shared';
import { FormInput, MaskedInput, AutoComplete, FormDropDown } from '../../../../../../../theme/form';

@inject('entityAccountStore', 'uiStore')
@observer
export default class General extends Component {
  componentWillMount() {
    this.props.uiStore.setErrors(null);
  }
  render() {
    const {
      GEN_INFO_FRM,
      genInfoChange,
      setAddressFields,
      maskedGenInfoChange,
    } = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">General information</Header>
        <p className="center-align">
          Let{"'"}s create your Entity Investment Account. Get started by providing your
          entity information.
        </p>
        {errors &&
          <Message error textAlign="left">
            <ListErrors errors={[errors]} />
          </Message>
        }
        <Form error>
          <div className="field-wrap">
            <FormInput
              name="name"
              fielddata={GEN_INFO_FRM.fields.name}
              changed={genInfoChange}
            />
            <Form.Group widths="equal">
              <MaskedInput
                name="taxId"
                fielddata={GEN_INFO_FRM.fields.taxId}
                changed={maskedGenInfoChange}
                format="##-#######"
                taxId
              />
              <FormDropDown
                fielddata={GEN_INFO_FRM.fields.entityType}
                selection
                containerclassname="dropdown-field"
                // value={GEN_INFO_FRM.fields.entityType.value}
                name="entityType"
                options={ENTITY_TYPES}
                placeholder="Select one"
                onChange={(e, result) => genInfoChange(e, result)}
              />
            </Form.Group>
            <h6>Registered Address</h6>
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
              <FormDropDown
                name="state"
                fielddata={GEN_INFO_FRM.fields.state}
                options={US_STATES_FOR_INVESTOR}
                search
                selection
                compact
                placeholder="Select"
                onChange={genInfoChange}
              />
              <MaskedInput
                name="zipCode"
                fielddata={GEN_INFO_FRM.fields.zipCode}
                changed={maskedGenInfoChange}
                zipCode
              />
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
