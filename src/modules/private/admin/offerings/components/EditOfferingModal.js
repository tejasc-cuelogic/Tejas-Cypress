import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, MaskedInput } from '../../../../../theme/form';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class EditOffering extends React.Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
    this.props.offeringCreationStore.setFormData('CLOSURE_SUMMARY_FRM', 'closureSummary');
  }
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    handleSubmitForm = () => {
      const {
        updateOffering,
        currentOfferingId,
      } = this.props.offeringCreationStore;
      updateOffering(currentOfferingId, null, 'editForm');
      this.props.history.push(this.props.refLink);
    }
    render() {
      const {
        KEY_TERMS_FRM,
        formChange,
        maskChange,
        CLOSURE_SUMMARY_FRM,
      } = this.props.offeringCreationStore;
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Header>Edit information</Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => this.handleSubmitForm()}>
              <FormInput
                name="shorthandBusinessName"
                fielddata={KEY_TERMS_FRM.fields.shorthandBusinessName}
                label="Business Name"
                changed={(e, result) => formChange(e, result, 'KEY_TERMS_FRM')}
              />
              <MaskedInput
                name="launchDate"
                label="Launch Date"
                fielddata={CLOSURE_SUMMARY_FRM.fields.launchDate}
                changed={(values, name) => maskChange(values, 'CLOSURE_SUMMARY_FRM', name)}
                dateOfBirth
              />
              <MaskedInput
                name="processingDate"
                label="Close Date"
                fielddata={CLOSURE_SUMMARY_FRM.fields.processingDate}
                changed={(values, name) => maskChange(values, 'CLOSURE_SUMMARY_FRM', name)}
                dateOfBirth
              />
              <div className="center-align">
                <Button className="relaxed" disabled={!(KEY_TERMS_FRM.meta.isValid)} primary >Save Changes</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      );
    }
}

