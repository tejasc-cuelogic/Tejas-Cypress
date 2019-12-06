import React, { Component } from 'react';
import { Header, Form, Message, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { US_STATES_FOR_INVESTOR, ENTITY_TYPES } from '../../../../../../../constants/account';
import { ListErrors } from '../../../../../../../theme/shared';
import { FormInput, MaskedInput, AutoComplete, FormDropDown } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('entityAccountStore', 'uiStore')
@observer
export default class General extends Component {
  constructor(props) {
    super(props);
    this.props.uiStore.setErrors(null);
    this.props.entityAccountStore.setFieldValue('GEN_INFO_FRM', 'required|taxId', 'fields.taxId.rule');
  }

  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.entityAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
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
      <>
        <Header as="h3" textAlign={isMobile ? '' : 'center'}>General information</Header>
        <p className={isMobile ? '' : 'center-align'}>
          Let
          {"'"}
          s create your Entity Investment Account. Get started by providing your
                    entity information.
        </p>
        <Form error>
          <div className={isMobile ? '' : 'field-wrap'}>
            <FormInput
              name="name"
              fielddata={GEN_INFO_FRM.fields.name}
              changed={genInfoChange}
              showerror
            />
            <Form.Group widths="equal">
              <MaskedInput
                name="taxId"
                fielddata={GEN_INFO_FRM.fields.taxId}
                changed={maskedGenInfoChange}
                format="##-#######"
                taxId
                showerror
              />
              <FormDropDown
                fielddata={GEN_INFO_FRM.fields.entityType}
                selection
                // value={GEN_INFO_FRM.fields.entityType.value}
                name="entityType"
                options={ENTITY_TYPES}
                placeholder="Select one"
                onChange={(e, result) => genInfoChange(e, result)}
              />
            </Form.Group>
            <Header as={!isMobile ? 'h5' : 'h4'}>Registered Address</Header>
            <AutoComplete
              name="street"
              fielddata={GEN_INFO_FRM.fields.street}
              onplaceselected={setAddressFields}
              changed={genInfoChange}
            />
            <FormInput
              name="streetTwo"
              fielddata={GEN_INFO_FRM.fields.streetTwo}
              changed={genInfoChange}
              showerror
            />
            <Form.Group widths="equal">
              <FormInput
                name="city"
                fielddata={GEN_INFO_FRM.fields.city}
                changed={genInfoChange}
                showerror
              />
              <FormDropDown
                name="state"
                fielddata={GEN_INFO_FRM.fields.state}
                options={US_STATES_FOR_INVESTOR}
                search
                selection
                placeholder="Select"
                onChange={genInfoChange}
              />
              <MaskedInput
                name="zipCode"
                fielddata={GEN_INFO_FRM.fields.zipCode}
                changed={maskedGenInfoChange}
                zipCode
                showerror
              />
            </Form.Group>
          </div>
          {errors
            && (
              <Message className={isMobile ? '' : 'center-align'} error>
                <ListErrors errors={[errors]} />
              </Message>
            )
          }
          {isMobile && (
            <Button fluid primary className="relaxed" content="Continue" disabled={!GEN_INFO_FRM.meta.isValid} onClick={this.handleContinueButton} />
          )
          }
        </Form>
      </>
    );
  }
}
