import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, FormSelect, FormDatePicker, MaskedInput } from '../../../components/form/FormElements';
import validationActions from './../../../actions/validation';
import { PROFILE_DETAILS_TITLE } from '../../../constants/profile';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore', 'userStore')
@observer
export default class investorPersonalDetails extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
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
    this.props.profileStore.submitInvestorPersonalDetails().then(() => {
      const { message, questions, softFailId } = this.props.profileStore.verifyIdentityResponse;
      if (message === 'FAIL' && questions) {
        this.props.profileStore.setIdentityQuestions(questions);
        this.props.profileStore.setSoftFailId(softFailId);
        this.props.setDashboardWizardStep('SelectQuestionsOrEditInformation');
      } else if (message === 'PASS') {
        this.props.setDashboardWizardStep('ConfirmPhoneNumber');
      }
    });
  }

  render() {
    const { verifyIdentity01, verifyIdentityEleChange, verifyIdentitySelChange } =
    this.props.profileStore;
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
                fielddata={verifyIdentity01.fields.title}
                options={PROFILE_DETAILS_TITLE}
                changed={verifyIdentitySelChange}
              />
              <FormInput
                type="text"
                name="firstLegalName"
                fielddata={verifyIdentity01.fields.firstLegalName}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="lastLegalName"
                fielddata={verifyIdentity01.fields.lastLegalName}
                changed={verifyIdentityEleChange}
              />
            </Form.Group>
            <FormInput
              type="text"
              name="residentalStreet"
              fielddata={verifyIdentity01.fields.residentalStreet}
              tooltip="Put your last name as listed on your driver license"
              changed={verifyIdentityEleChange}
            />
            <Form.Group widths="equal">
              <FormInput
                type="text"
                name="city"
                fielddata={verifyIdentity01.fields.city}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="state"
                fielddata={verifyIdentity01.fields.state}
                changed={verifyIdentityEleChange}
              />
              <FormInput
                type="text"
                name="zipCode"
                fielddata={verifyIdentity01.fields.zipCode}
                changed={verifyIdentityEleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <MaskedInput
                name="phoneNumber"
                fielddata={verifyIdentity01.fields.phoneNumber}
                mask="999-999-9999"
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
            <MaskedInput
              name="ssn"
              fielddata={verifyIdentity01.fields.ssn}
              mask="999-999-9999"
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button size="large" color="green" className="very relaxed" >Verify my identity</Button>
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
