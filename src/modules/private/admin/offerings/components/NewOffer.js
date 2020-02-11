import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput, FormDropDown } from '../../../../../theme/form';
import { REGULATION_VALUES, OFFERING_TEMPLATE_VALUES } from '../../../../../services/constants/admin/offerings';

@inject('offeringCreationStore')
@observer
export default class NewOffer extends Component {
  constructor(props) {
    super(props);
    this.props.offeringCreationStore.resetForm('NEW_OFFER_FRM');
  }

  handleCloseModal = () => {
    this.props.history.push('/dashboard/offerings/creation');
  }

  handleSubmit = () => {
    const { addNewOffer } = this.props.offeringCreationStore;
    addNewOffer();
    this.handleCloseModal();
  }

  change = (e, result, formName, field) => {
    this.props.offeringCreationStore.formChange(e, result, formName);
    if (field !== 'regulation' && field !== 'template') {
      this.props.offeringCreationStore.offerCreateChange(formName, field);
    }
  }

  render() {
    const { NEW_OFFER_FRM } = this.props.offeringCreationStore;
    const formName = 'NEW_OFFER_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Create New Offering</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form onSubmit={this.handleSubmit}>
            {
              ['legalBusinessName', 'shorthandBusinessName', 'offeringSlug'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={NEW_OFFER_FRM.fields[field]}
                  changed={(e, result) => this.change(e, result, formName, field)}
                />
              ))
            }
            {['regulation', 'template'].map(field => (
              <FormDropDown
                containerclassname="dropdown-field"
                fluid
                fielddata={NEW_OFFER_FRM.fields[field]}
                selection
                value={NEW_OFFER_FRM.fields[field].value}
                name={field}
                placeholder="Choose here"
                options={field === 'regulation' ? REGULATION_VALUES : OFFERING_TEMPLATE_VALUES}
                onChange={(e, result) => this.change(e, result, formName, field)}
              />
            ))}
            <div className="center-align">
              <Button primary content="Add new offering" disabled={!NEW_OFFER_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
