import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import FieldError from '../../../components/common/FieldError';
import validationActions from '../../../actions/validation';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class NewBusinessForm extends React.Component {
  handleOnChange = (e, { name, value }) => {
    validationActions.validateNewOfferingInfoField(name, value);
  }

  handleOnChangeOnEdit = (e, { name, value }) => {
    this.props.businessStore.setBusinessDetailsOnEdit(name, value);
  }

  handleEditBusiness = (e) => {
    e.preventDefault();
    businessActions.editBusinessDetails();
  }

  handleBusinessNameOnBlur = (e) => {
    businessActions.businessExists(e.target.value);
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    businessActions.createBusiness();
  }

  handleOpenModal = () => {
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus(true);
    this.props.businessStore.setEditBusinessMode(false);
  }

  handleCloseModal = () => {
    this.props.uiStore.setModalStatus(false);
  }

  render() {
    const { newOfferingInformation, editBusinessMode, business } = this.props.businessStore;
    return (
      <div>
        {!this.props.businessid &&
          <Button onClick={this.handleOpenModal} color="green" className="rounded" floated="right">+ New Business</Button>
        }
        <Modal
          size="small"
          open={this.props.uiStore.modalStatus}
          closeIcon
          onOpen={this.handleOpenModal}
          onClose={this.handleCloseModal}
        >
          <Modal.Header>{editBusinessMode === false ? 'Add New Business' : 'Edit Business'}</Modal.Header>
          <Modal.Content>
            {editBusinessMode === false &&
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
            }
            {editBusinessMode &&
            <Form error>
              <Form.Input
                placeholder="Business Name"
                className="column"
                label="Business Name"
                name={business.name.key}
                defaultValue={business.name.value}
                error={!!business.name.error}
                onChange={this.handleOnChangeOnEdit}
                onBlur={this.handleBusinessNameOnBlur}
              />
              <FieldError error={business.name.error} />
              <Form.TextArea
                placeholder="Description"
                className="column"
                label="Description"
                name={business.desc.key}
                defaultValue={business.desc.value}
                error={!!business.desc.error}
                onChange={this.handleOnChangeOnEdit}
              />
              <FieldError error={business.desc.error} />
            </Form>
            }
          </Modal.Content>
          <Modal.Actions>
            { editBusinessMode === false &&
            <Button
              color="green"
              disabled={
                !this.props.businessStore.canSubmitNewOfferingForm ||
                  this.props.uiStore.submitButtonDisabled
              }
              onClick={this.handleSubmitForm}
            >
              Submit
            </Button>}
            { editBusinessMode === true &&
            <Button
              color="green"
              disabled={
                !this.props.businessStore.canSubmitEditBusinessForm ||
                  this.props.uiStore.submitButtonDisabled
              }
              onClick={this.handleEditBusiness}
            >
              Submit
            </Button>}
          </Modal.Actions>
        </Modal>
      </div>

    );
  }
}
