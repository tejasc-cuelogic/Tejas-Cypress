import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, MaskedInput } from '../../../../../theme/form';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class EditOffering extends React.Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('KEY_TERMS_FRM', 'keyTerms');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
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
        COMPANY_LAUNCH_FRM,
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
              {
              ['targetDate', 'terminationDate'].map(field => (
                <MaskedInput
                  name={field}
                  label={field === 'targetDate' ? 'Launch Date' : 'Close Date'}
                  fielddata={COMPANY_LAUNCH_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'COMPANY_LAUNCH_FRM', name)}
                  dateOfBirth
                />
              ))
            }
              <div className="center-align">
                <Button className="relaxed" disabled={!COMPANY_LAUNCH_FRM.meta.isValid} primary >Save Changes</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      );
    }
}

