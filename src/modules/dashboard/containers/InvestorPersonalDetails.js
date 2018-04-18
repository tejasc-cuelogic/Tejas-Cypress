import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, FormSelect, FormDatePicker } from '../../../components/form/FormElements';
import validationActions from './../../../actions/validation';
import { PROFILE_DETAILS_TITLE } from '../../../constants/profile';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore', 'userStore')
@observer
export default class investorPersonalDetails extends Component {
  componentWillMount() {
    // const { currentUser } = this.props.userStore;
    // this.props.profileStore.setProfileDetails('firstLegalName', currentUser.givenName);
    // this.props.profileStore.setProfileDetails('lastLegalName', currentUser.familyName);
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    // this.props.profileStore.resetProfileDetails();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateProfileDetailsField(name, value);

  handleAutocompleteInputChange = e =>
    validationActions.validateProfileDetailsField(e.target.name, e.target.value);

  handleDateChange = (date) => {
    // validationActions.validateProfileDetailsField('dateOfBirth', date);
    console.log('non-raw', date);
  }

  handleChangeRaw = (date) => {
    console.log(date, 'changeRaw');
  }

  handleMaskedInputChange = (e) => {
    const maskedInputValue = e.target.value;
    const unMaskedInputValue = Helper.unMaskInput(maskedInputValue);
    validationActions.validateProfileDetailsField(e.target.name, unMaskedInputValue);
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateProfileDetailsForm();
    if (this.props.profileStore.canSubmitProfileDetails) {
      this.props.setDashboardWizardStep('SelectQuestionsOrEditInformation');
    }
  }

  render() {
    const { verifyIdentity01, verifyIdentityEleChange } = this.props.profileStore;
    const welcomeMsg = `Hello ${this.props.userStore.currentUser.givenName}!`;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">{welcomeMsg}</Header>
          <p>You’re almost at your personal dashboard</p>
          <Divider />
          <p><Link to="">Federal regulations</Link> require us to collect some more info
            to enable you to fully use your account
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              <FormSelect
                containerwidth={6}
                name="title"
                label={verifyIdentity01.fields.title.label}
                value={verifyIdentity01.fields.title.value}
                error={verifyIdentity01.fields.title.error}
                options={PROFILE_DETAILS_TITLE}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="firstLegalName"
                label={verifyIdentity01.fields.firstLegalName.label}
                tooltip="Put your first name as listed on your driver license"
                value={verifyIdentity01.fields.firstLegalName.value}
                error={verifyIdentity01.fields.firstLegalName.error}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="lastLegalName"
                label={verifyIdentity01.fields.lastLegalName.label}
                tooltip="Put your last name as listed on your driver license"
                value={verifyIdentity01.fields.lastLegalName.value}
                error={verifyIdentity01.fields.lastLegalName.error}
                changed={verifyIdentityEleChange}
              />
            </Form.Group>
            <FormInput
              type="text"
              name="residentalStreet"
              label={verifyIdentity01.fields.residentalStreet.label}
              tooltip="Put your last name as listed on your driver license"
              value={verifyIdentity01.fields.residentalStreet.value}
              error={verifyIdentity01.fields.residentalStreet.error}
              changed={verifyIdentityEleChange}
            />
            <Form.Group widths="equal">
              <FormInput
                type="text"
                name="city"
                label={verifyIdentity01.fields.city.label}
                value={verifyIdentity01.fields.city.value}
                error={verifyIdentity01.fields.city.error}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="state"
                label={verifyIdentity01.fields.state.label}
                value={verifyIdentity01.fields.state.value}
                error={verifyIdentity01.fields.state.error}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="zipCode"
                label={verifyIdentity01.fields.zipCode.label}
                value={verifyIdentity01.fields.zipCode.value}
                error={verifyIdentity01.fields.zipCode.error}
                changed={verifyIdentityEleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <FormInput
                type="text"
                name="phoneNumber"
                label={verifyIdentity01.fields.phoneNumber.label}
                value={verifyIdentity01.fields.phoneNumber.value}
                error={verifyIdentity01.fields.phoneNumber.error}
                changed={verifyIdentityEleChange}
              />
              <FormDatePicker
                type="text"
                name="dateOfBirth"
                label={verifyIdentity01.fields.dateOfBirth.label}
                selected={verifyIdentity01.fields.dateOfBirth.value}
                error={verifyIdentity01.fields.dateOfBirth.error}
                changed={verifyIdentityEleChange}
              />
            </Form.Group>
            <FormInput
              type="text"
              name="ssn"
              label={verifyIdentity01.fields.ssn.label}
              value={verifyIdentity01.fields.ssn.value}
              error={verifyIdentity01.fields.ssn.error}
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button size="large" className="very relaxed" disabled={!verifyIdentity01.meta.isValid}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
