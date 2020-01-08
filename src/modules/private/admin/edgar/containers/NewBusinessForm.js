import React from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FieldError } from '../../../../../theme/shared';
import { validationActions, businessActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';

@withRouter
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

  componentDidMount() {
    Object.assign(this.state, {
      name: toJS(this.props.businessStore.business.name),
      desc: toJS(this.props.businessStore.business.desc),
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

  handleSubmitForm = () => {
    businessActions.createBusiness()
      .then((data) => {
        this.props.history.push(`/dashboard/edgar/${data.body.data.createBusiness.id}`);
        this.props.uiStore.setModalStatus(false);
        Helper.toast(`New business ${data.body.data.createBusiness.name} has been created successfully`, 'success');
      })
      .finally(() => {
        this.props.uiStore.setProgress(false);
      });
  }

  handleOpenModal = () => {
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus('BusinessForm');
    this.props.businessStore.setEditBusinessMode(false);
  }

  handleCloseModal = () => {
    this.props.uiStore.setModalStatus(false);
  }

  render() {
    const { newOfferingInformation, editBusinessMode } = this.props.businessStore;
    return (
      <div>
        {!this.props.businessid
          && <Button primary floated="right" onClick={this.handleOpenModal}>+ New Business</Button>
        }
        <Modal
          size="small"
          open={this.props.uiStore.modalStatus === 'BusinessForm'}
          closeIcon
          onOpen={this.handleOpenModal}
          onClose={this.handleCloseModal}
        >
          <Modal.Header>{editBusinessMode === false ? 'Add New Business' : 'Edit Business'}</Modal.Header>
          <Modal.Content>
            {editBusinessMode === false
            && (
<Form error>
              <Form.Input
                loading={this.props.uiStore.asyncCheckLoader}
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
              <div className="center-align">
                <Button
                  primary
                  disabled={
                    !this.props.businessStore.canSubmitNewOfferingForm
                      || this.props.uiStore.submitButtonDisabled
                  }
                  onClick={this.handleSubmitForm}
                >
                  Submit
                </Button>
              </div>
            </Form>
            )
            }
            {editBusinessMode
            && (
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
              <div className="center-align">
                <Button
                  primary
                  disabled={
                    !((this.state.name.value !== '' && this.state.desc.value !== '')
                      || this.props.uiStore.submitButtonDisabled)
                  }
                  onClick={this.handleEditBusiness}
                >
                  Submit
                </Button>
              </div>
            </Form>
            )
            }
          </Modal.Content>
        </Modal>
      </div>

    );
  }
}
