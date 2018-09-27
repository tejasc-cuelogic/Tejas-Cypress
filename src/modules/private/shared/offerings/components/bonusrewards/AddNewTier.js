import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormCheckbox } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class AddNewTier extends Component {
  handleCloseModal = () => {
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
          <Form>
            <div className="featured-section">
              <FormCheckbox
                fielddata={ADD_NEW_TIER_FRM.fields.isEarlyBirds}
                name="isEarlyBirds"
                changed={(e, result) => formChange(e, result, formName)}
                defaults
                containerclassname="ui relaxed list"
              />
              {
                ADD_NEW_TIER_FRM.fields.isEarlyBirds.value.includes('EARLY_BIRDS') ?
                  <Aux>
                    <FormInput
                      name="amountForEarlyBird"
                      fielddata={ADD_NEW_TIER_FRM.fields.amountForEarlyBird}
                      changed={(e, result) => formChange(e, result, formName)}
                    />
                    <MaskedInput
                      number
                      name="earlyBirdQuantity"
                      fielddata={ADD_NEW_TIER_FRM.fields.earlyBirdQuantity}
                      changed={(values, field) => maskChange(values, formName, field)}
                    />
                  </Aux>
                  :
                  <FormInput
                    name="amountForThisTier"
                    fielddata={ADD_NEW_TIER_FRM.fields.amountForThisTier}
                    changed={(e, result) => formChange(e, result, formName)}
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
