import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput, FormSelect, FormDatePicker, MaskedInput, AutoComplete } from '../../../theme/form/FormElements';
import { PROFILE_DETAILS_TITLE } from '../../../constants/profile';
import profileActions from '../../../actions/profile';
import Helper from '../../../helper/utility';
import CipErrors from '../../../theme/common/CipErrors';
import ListErrors from '../../../theme/common/ListErrors';

@inject('profileStore', 'uiStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
export default class investorPersonalDetails extends Component {
  componentWillMount() {
    if (this.props.profileStore.verifyIdentity01.fields.phoneNumber.value === '') {
      if (this.props.userDetailsStore.userDetails.contactDetails.phone) {
        const fieldValue =
        Helper.maskPhoneNumber(this.props.userDetailsStore.userDetails.contactDetails.phone.number);
        this.props.profileStore.onFieldChange('verifyIdentity01', 'phoneNumber', fieldValue);
      }
    }
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleSubmitInvestorDetails = (e) => {
    e.preventDefault();
    /* eslint-disable camelcase */
    this.props.profileStore.submitInvestorPersonalDetails().then(() => {
      const { key, questions } = this.props.profileStore.verifyIdentity01.response;
      if (key === 'id.error') {
        Helper.toast('User verification failed!', 'error');
        this.props.setDashboardWizardStep('ConfirmIdentityDocuments');
      } else if (key === 'id.failure' && questions) {
        Helper.toast('User verification soft-failed!', 'error');
        this.props.profileStore.setIdentityQuestions();
        this.props.setDashboardWizardStep('ConfirmIdentityForm');
      } else if (key === 'id.success') {
        Helper.toast('User verification passed!', 'success');
        if (this.props.userDetailsStore.userDetails.contactDetails.phone &&
          this.props.userDetailsStore.userDetails.contactDetails.phone.verificationDate) {
          this.props.setDashboardWizardStep();
        } else {
          this.props.profileStore.startPhoneVerification().then(() => {
            this.props.setDashboardWizardStep('ConfirmPhoneNumber');
          })
            .catch((err) => { this.props.uiStore.setErrors(JSON.stringify(err.message)); });
        }
      } else {
        Helper.toast('User verification hard-failed!', 'error');
        this.props.setDashboardWizardStep('ConfirmIdentityDocuments');
      }
    })
      .catch(() => { });
  }

  handleCloseModal = () => {
    this.props.setDashboardWizardStep();
    this.props.profileStore.resetFormData('verifyIdentity01');
  }

  render() {
    const {
      verifyIdentity01,
      verifyIdentityEleChange,
      verifyIdentityDateChange,
    } = this.props.profileStore;
    const welcomeMsg = `Hello ${this.props.userStore.currentUser.givenName}!`;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">{welcomeMsg}</Header>
          <p>Let’s get you set up with a NextSeed investment <br /> account.</p>
          <Divider />
          <p>
            Federal regulations require us to verify your legal<br />
            identity. We use state-of-the-art security measures<br /> to protect your information.
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors]} />
            </Message>
          }
          {this.props.profileStore.verifyIdentity01.response.qualifiers &&
          <Message error>
            <CipErrors errorsList={this.props.profileStore.verifyIdentity01.response.qualifiers} />
          </Message>
          }
          <Form error onSubmit={this.handleSubmitInvestorDetails}>
            <Form.Group widths="equal">
              <FormSelect
                containerwidth={8}
                name="title"
                fielddata={verifyIdentity01.fields.title}
                options={PROFILE_DETAILS_TITLE}
                changed={verifyIdentityEleChange}
              />
              {
                ['firstLegalName', 'lastLegalName'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={verifyIdentity01.fields[field]}
                    changed={verifyIdentityEleChange}
                  />
                ))
              }
            </Form.Group>
            <AutoComplete
              name="residentalStreet"
              fielddata={verifyIdentity01.fields.residentalStreet}
              onplaceselected={profileActions.setAddressFieldsOnGoogleAutocomplete}
              changed={verifyIdentityEleChange}
            />
            <Form.Group widths="equal">
              {
                ['city', 'state', 'zipCode'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={verifyIdentity01.fields[field]}
                    changed={verifyIdentityEleChange}
                  />
                ))
              }
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
              mask="999-99-9999"
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} size="large" color="green" className="very relaxed" disabled={!verifyIdentity01.meta.isValid}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={this.handleCloseModal}>I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
