import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../theme/form';
import Helper from '../../../helper/utility';
import { ListErrors } from '../../../theme/common';

@inject('profileStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    if (this.props.profileStore.verifyIdentity01.fields.phoneNumber.value === '') {
      if (this.props.userDetailsStore.userDetails.contactDetails.phone) {
        const fieldValue =
        Helper.maskPhoneNumber(this.props.userDetailsStore.userDetails.contactDetails.phone.number);
        this.props.profileStore.onFieldChange('verifyIdentity01', 'phoneNumber', fieldValue);
      }
    }
  }
  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.profileStore.setReSendVerificationCode(false);
    if (this.props.refLink) {
      this.props.profileStore.verifyAndUpdatePhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.history.replace('/app/profile-settings/profile-data');
        this.props.uiStore.clearErrors();
        this.props.profileStore.resetFormData('verifyIdentity04');
      })
        .catch(() => { });
    } else {
      this.props.profileStore.confirmPhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.setDashboardWizardStep('InvestmentChooseType');
      })
        .catch(() => {});
    }
  }

  handleChangePhoneNumber = () => {
    if (!this.props.newPhoneNumber) {
      this.props.uiStore.setEditMode(true);
    } else {
      this.props.uiStore.clearErrors();
    }
  }

  startPhoneVerification = () => {
    this.props.profileStore.setReSendVerificationCode(true);
    this.props.profileStore.startPhoneVerification();
    if (!this.props.refLink) {
      this.props.uiStore.setEditMode(false);
    }
  }

  handleCloseModal = () => {
    this.props.uiStore.setDashboardWizardStep();
    if (this.props.refLink) {
      this.props.history.replace(this.props.refLink);
    }
    this.props.uiStore.clearErrors();
    this.props.profileStore.resetFormData('verifyIdentity04');
  }

  render() {
    const {
      verifyIdentity01,
      verifyIdentity04,
      verifyIdentityEleChange,
      verifyVerificationCodeChange,
    } = this.props.profileStore;
    const { errors, editMode } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <MaskedInput
            value={verifyIdentity01.fields.phoneNumber.value}
            type="tel"
            name="phoneNumber"
            fielddata={verifyIdentity01.fields.phoneNumber}
            mask="999-999-9999"
            readOnly={!editMode}
            changed={verifyIdentityEleChange}
            hidelabel
            className="display-only"
          />
          {editMode ?
            <p>
              <Link to={this.props.match.url} onClick={this.startPhoneVerification}>
                Confirm Phone number
              </Link>
            </p> :
            <p>
              <Link
                to={this.props.refLink ? this.props.refLink : this.props.match.url}
                onClick={this.handleChangePhoneNumber}
              >
                Change phone number
              </Link>
            </p>
          }
          <Form error onSubmit={this.handleConfirmPhoneNumber}>
            <FormInput
              name="code"
              size="huge"
              containerclassname="otp-field"
              maxLength={6}
              fielddata={verifyIdentity04.fields.code}
              changed={verifyVerificationCodeChange}
            />
            <div className="center-align">
              <Button loading={!this.props.profileStore.reSendVerificationCode && this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!verifyIdentity04.meta.isValid}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button loading={this.props.profileStore.reSendVerificationCode && this.props.uiStore.inProgress} type="button" className="cancel-link" onClick={() => this.startPhoneVerification()}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
