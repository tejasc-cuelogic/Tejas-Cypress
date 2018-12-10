import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, MaskedInput } from '../../../../../theme/form';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class EditOffering extends React.Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('POC_DETAILS_FRM', '');
  }
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    handleSubmitForm = () => {
      const {
        updateOffering,
        currentOfferingId,
      } = this.props.offeringCreationStore;
      updateOffering(currentOfferingId, null, 'editPocForm');
      this.props.history.push(this.props.refLink);
    }
    render() {
      const {
        POC_DETAILS_FRM,
        formChange,
        maskChange,
      } = this.props.offeringCreationStore;
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Header>Edit information</Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => this.handleSubmitForm()}>
              {
              ['address', 'name'].map(field => (
                <FormInput
                  name={field}
                  fielddata={POC_DETAILS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'POC_DETAILS_FRM')}
                />
              ))
            }
              <MaskedInput
                name="targetDate"
                fielddata={POC_DETAILS_FRM.fields.targetDate}
                changed={(values, name) => maskChange(values, 'POC_DETAILS_FRM', name)}
                dateOfBirth
              />
              <div className="center-align">
                <Button className="relaxed" disabled={!POC_DETAILS_FRM.meta.isValid} primary >Save Changes</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      );
    }
}

