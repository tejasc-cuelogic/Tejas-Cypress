import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import FieldError from '../../../components/common/FieldError';
import validationActions from '../../../actions/validation';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class NewBusinessForm extends React.Component {
  handleOpenModal = () => {
    this.props.businessStore.resetNewOfferingInfo();
  }

  handleOnChange = (e, { name, value }) => {
    validationActions.validateNewOfferingInfoField(name, value);
  }

  handleBusinessNameOnBlur = () => {
    businessActions.businessExists();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    businessActions.createBusiness();
  }

  handleOpenModal = () => {
    this.props.uiStore.setModalStatus(true);
  }

  render() {
    const { newOfferingInformation } = this.props.businessStore;
    return (
      <div>
        <Button onClick={this.handleOpenModal} color="green" floated="right">New Offering</Button>
        <Modal size="small" open={this.props.uiStore.modalStatus} closeIcon onOpen={this.handleOpenModal}>
          <Modal.Header>Add New Offering</Modal.Header>
          <Modal.Content>
            <Form error>
              <Form.Input
                placeholder={newOfferingInformation.businessName.label}
                className="column"
                label={newOfferingInformation.businessName.label}
                name={newOfferingInformation.businessName.key}
                defaultValue={newOfferingInformation.businessName.value}
                error={!!newOfferingInformation.businessName.error}
                onChange={this.handleOnChange}
                onBlur={this.handleBusinessNameOnBlur}
              />
              <FieldError error={newOfferingInformation.businessName.error} />
              <Form.TextArea
                placeholder={newOfferingInformation.businessDescription.label}
                className="column"
                label={newOfferingInformation.businessDescription.label}
                name={newOfferingInformation.businessDescription.key}
                defaultValue={newOfferingInformation.businessDescription.value}
                error={!!newOfferingInformation.businessDescription.error}
                onChange={this.handleOnChange}
              />
              <FieldError error={newOfferingInformation.businessDescription.error} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              onClick={this.handleSubmitForm}
              disabled={
                !this.props.businessStore.canSubmitNewOfferingForm ||
                  this.props.uiStore.submitButtonDisabled
              }
            >
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      </div>

    );
  }
}
