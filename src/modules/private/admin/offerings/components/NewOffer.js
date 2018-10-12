import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { BUSINESS_INDUSTRIES, BUSINESS_TYPE_VALUES } from '../../../../../services/constants/admin/offerings';
import { FormDropDown, FormInput } from '../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class NewOffer extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.resetForm('NEW_OFFER_FRM');
  }
  handleCloseModal = () => {
    this.props.history.push('/app/offerings/creation');
  }
  handleSubmit = () => {
    const { addNewOffer } = this.props.offeringCreationStore;
    addNewOffer();
    this.handleCloseModal();
  }
  render() {
    const { NEW_OFFER_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'NEW_OFFER_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Create New Offering</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form onSubmit={this.handleSubmit}>
            {
              ['legalBusinessName', 'shorthandBusinessName'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={NEW_OFFER_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                />))
            }
            {
              ['industry', 'legalBusinessType'].map(field => (
                <FormDropDown
                  fielddata={NEW_OFFER_FRM.fields[field]}
                  selection
                  containerclassname="dropdown-field"
                  value={NEW_OFFER_FRM.fields[field].value}
                  key={field}
                  name={field}
                  options={field === 'industry' ? BUSINESS_INDUSTRIES : BUSINESS_TYPE_VALUES}
                  onChange={(e, result) => formChange(e, result, formName)}
                />))
            }
            <div className="center-align">
              <Button primary content="Add new offering" disabled={!NEW_OFFER_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
