import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { MaskedInput, FormCheckbox } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class AddNewTier extends Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  handleAddTier = () => {
    const { addNewTier } = this.props.offeringCreationStore;
    addNewTier();
    this.props.history.push(this.props.refLink);
  }
  render() {
    const { ADD_NEW_TIER_FRM, formChange, maskChange } = this.props.offeringCreationStore;
    const formName = 'ADD_NEW_TIER_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Add new tier</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form onSubmit={this.handleAddTier}>
            <div className="featured-section">
              <FormCheckbox
                fielddata={ADD_NEW_TIER_FRM.fields.isEarlyBirds}
                name="isEarlyBirds"
                changed={(e, result) => formChange(e, result, formName, true)}
                defaults
                containerclassname="ui relaxed list"
                disabled
              />
              {
                ADD_NEW_TIER_FRM.fields.isEarlyBirds.value.includes('EARLY_BIRDS') ?
                  <Aux>
                    <MaskedInput
                      currency
                      prefix="$"
                      name="amountForEarlyBird"
                      fielddata={ADD_NEW_TIER_FRM.fields.amountForEarlyBird}
                      changed={(values, field) => maskChange(values, formName, field)}
                    />
                    <MaskedInput
                      number
                      name="earlyBirdQuantity"
                      fielddata={ADD_NEW_TIER_FRM.fields.earlyBirdQuantity}
                      changed={(values, field) => maskChange(values, formName, field)}
                    />
                  </Aux>
                  :
                  <MaskedInput
                    currency
                    prefix="$"
                    name="amountForThisTier"
                    fielddata={ADD_NEW_TIER_FRM.fields.amountForThisTier}
                    changed={(values, field) => maskChange(values, formName, field)}
                  />
              }
            </div>
            <div className="center-align">
              <Button primary content="Add new bonus reward" disabled={!ADD_NEW_TIER_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
