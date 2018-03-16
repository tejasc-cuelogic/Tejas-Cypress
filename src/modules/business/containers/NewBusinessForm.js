import React from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import FieldError from '../../../components/common/FieldError';
import validationActions from '../../../actions/validation';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class NewBusinessForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: {},
      desc: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    Object.assign(this.state, {
      name: toJS(nextProps.businessStore.business.name),
      desc: toJS(nextProps.businessStore.business.desc),
    });
  }

  handleOnChange = (e, { name, value }) => {
    validationActions.validateNewOfferingInfoField(name, value);
  }

  handleOnChangeOnEdit = (e, { name, value }) => {
    const newState = Object.assign({}, this.state);
    newState[name].value = value;
    if (value === '') {
      newState[name].error = `${newState[name].key} field is required.`;
    } else {
      newState[name].error = '';
    }
    this.setState({
      ...newState,
    });
  }

  handleEditBusiness = (e) => {
    e.preventDefault();
    this.props.businessStore.setBusinessDetailsOnEdit(this.state.name.key, this.state.name.value);
    this.props.businessStore.setBusinessDetailsOnEdit(this.state.desc.key, this.state.desc.value);
    businessActions.editBusinessDetails();
  }

  handleBusinessNameOnBlur = (e) => {
    businessActions.businessExists(e.target.value);
  }

  handleBusinessNameOnBlurOnEdit = (e) => {
    const newState = Object.assign({}, this.state);
    businessActions.businessExistsOnEdit(e.target.value)
      .then((res) => {
        if (res.body.data.businessExists) {
          newState.name.error = 'Business Name is already exist.';
          this.setState({
            ...newState,
          });
        } else {
          if (newState.name.value !== '') {
            newState.name.error = '';
          }
          this.setState({
            ...newState,
          });
        }
      });
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
    const { newOfferingInformation, editBusinessMode } = this.props.businessStore;
    return (
      <div>
        <Button onClick={this.handleOpenModal} color="green" className="rounded" floated="right">+ New Offering</Button>
        <Modal
          size="small"
          open={this.props.uiStore.modalStatus}
          closeIcon
          onOpen={this.handleOpenModal}
          onClose={this.handleCloseModal}
        >
          <Modal.Header>{editBusinessMode === false ? 'Add New Offering' : 'Edit Offering'}</Modal.Header>
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
                name={this.state.name.key}
                defaultValue={this.state.name.value}
                error={!!this.state.name.error}
                onChange={this.handleOnChangeOnEdit}
                onBlur={this.handleBusinessNameOnBlurOnEdit}
              />
              <FieldError error={this.state.name.error} />
              <Form.TextArea
                placeholder="Description"
                className="column"
                label="Description"
                name={this.state.desc.key}
                defaultValue={this.state.desc.value}
                error={!!this.state.desc.error}
                onChange={this.handleOnChangeOnEdit}
              />
              <FieldError error={this.state.desc.error} />
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
                !((this.state.name.value !== '' && this.state.desc.value !== '') ||
                  this.props.uiStore.submitButtonDisabled)
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
