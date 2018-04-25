import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, FormSelect, FormDatePicker, MaskedInput, AutoComplete } from '../../../components/form/FormElements';
import { PROFILE_DETAILS_TITLE } from '../../../constants/profile';
import profileActions from '../../../actions/profile';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore', 'userStore')
@observer
export default class investorPersonalDetails extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.profileStore.submitInvestorPersonalDetails().then(() => {
      const { message, questions } = this.props.profileStore.verifyIdentity01.response;
      if (message === 'FAIL' && questions) {
        Helper.toast('User verification soft-failed!', 'error');
        this.props.profileStore.setIdentityQuestions();
        this.props.setDashboardWizardStep('SelectQuestionsOrEditInformation');
      } else if (message === 'PASS') {
        Helper.toast('User verification passed!', 'success');
        this.props.profileStore.startPhoneVerification();
        this.props.setDashboardWizardStep('ConfirmPhoneNumber');
      } else {
        Helper.toast('User verification hard-failed!', 'error');
      }
    });
  }

  render() {
    const {
      verifyIdentity01,
      verifyIdentityEleChange,
      verifyIdentitySelChange,
      verifyIdentityDateChange,
    } = this.props.profileStore;
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
            <AutoComplete
              name="residentalStreet"
              fielddata={verifyIdentity01.fields.residentalStreet}
              onplaceselected={profileActions.setAddressFieldsOnGoogleAutocomplete}
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
                fielddata={verifyIdentity01.fields.dateOfBirth}
                selected={verifyIdentity01.fields.dateOfBirth.value}
                changed={verifyIdentityDateChange}
              />
            </Form.Group>
            <MaskedInput
              name="ssn"
              fielddata={verifyIdentity01.fields.ssn}
              mask="999-999-9999"
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button size="large" color="green" className="very relaxed" disabled={!verifyIdentity01.meta.isValid}>Verify my identity</Button>
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
