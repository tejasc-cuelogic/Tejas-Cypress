import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class AddNewTier extends Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  render() {
    const { ADD_NEW_TIER_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'ADD_NEW_TIER_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3" textAlign="left">Add new tier</Header>
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
                ['amountForEarlyBird', 'earlyBirdQuantity'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    fielddata={ADD_NEW_TIER_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, formName)}
                  />
                ))
                :
                <FormInput
                  name="amountForThisTier"
                  fielddata={ADD_NEW_TIER_FRM.fields.amountForThisTier}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              }
            </div>
            <Button disabled={!ADD_NEW_TIER_FRM.meta.isValid} floated="right" primary content="Add new bonus reward" />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
