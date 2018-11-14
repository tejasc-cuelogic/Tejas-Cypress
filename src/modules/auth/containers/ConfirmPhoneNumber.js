/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import Helper from '../../../helper/utility';
import { MaskedInput } from '../../../theme/form';
import { ListErrors } from '../../../theme/shared';

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    if (this.props.identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      if (this.props.userDetailsStore.userDetails.phone &&
        this.props.userDetailsStore.userDetails.phone.number) {
        const fieldValue = this.props.userDetailsStore.userDetails.phone.number;
        this.props.identityStore.phoneNumberChange(fieldValue);
      }
    }
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }
  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.identityStore.setReSendVerificationCode(false);
    if (this.props.refLink) {
      this.props.identityStore.verifyAndUpdatePhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.history.replace('/app/profile-settings/profile-data');
        this.props.uiStore.clearErrors();
        this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
      })
        .catch(() => { });
    } else {
      this.props.identityStore.confirmPhoneNumber().then(() => {
        Helper.toast('Phone number is confirmed.', 'success');
        this.props.history.push('/app/summary/establish-profile');
      })
        .catch(() => { });
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
    this.props.identityStore.setReSendVerificationCode(true);
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
    this.props.uiStore.clearErrors();
    this.props.identityStore.startPhoneVerification();
    if (!this.props.refLink) {
      this.props.uiStore.setEditMode(false);
    }
  }
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.replace(this.props.refLink);
    } else {
      this.props.history.push('/app/summary');
    }
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
  }
  render() {
    const {
      ID_VERIFICATION_FRM,
      personalInfoMaskedChange,
      ID_PHONE_VERIFICATION,
      phoneVerificationChange,
      reSendVerificationCode,
    } = this.props.identityStore;
    const { errors, editMode } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your phone number</Header>
          <p>
            We use Multi-Factor Authentication (MFA) to increase the security of your NextSeed
            investment account.
          </p>
          <Divider section />
          <p>Please confirm the 6-digit verification code sent to your phone number</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {/* {errors &&
            <Message error>
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          } */}
          <MaskedInput
            hidelabel
            value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
            type="tel"
            name="phoneNumber"
            fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
            format="###-###-####"
            readOnly={!editMode}
            displayMode={!editMode}
            changed={personalInfoMaskedChange}
            containerclassname="display-only"
            className="display-only"
            phoneNumberDisplayMode
          />
          {editMode ?
            <Link className="grey-link green-hover" to={this.props.match.url} onClick={this.startPhoneVerification}>
              Confirm Phone number
            </Link> :
            <Link className="grey-link green-hover" to={this.props.refLink ? this.props.refLink : this.props.match.url} onClick={this.handleChangePhoneNumber}>
              Change phone number
            </Link>
          }
          <Form className="mb-20" error onSubmit={this.handleConfirmPhoneNumber}>
            <Form.Field className="otp-wrap">
              <label>Enter verification code here:</label>
              <ReactCodeInput
                name="code"
                fields={6}
                type="number"
                className="otp-field"
                fielddata={ID_PHONE_VERIFICATION.fields.code}
                onChange={phoneVerificationChange}
              />
              <Button type="button" size="small" color="grey" className="link-button green-hover" content="Resend the code to my phone" loading={reSendVerificationCode && this.props.uiStore.inProgress} onClick={() => this.startPhoneVerification()} />
            </Form.Field>
            {errors &&
              <Message error textAlign="left" className="mb-40">
                <ListErrors errors={[errors.message]} />
              </Message>
            }
            {/* THIS HEADER WILL BE VISIBLE AFTER SUCCESS */}
            {/* <Header as="h3" className="success-msg mb-60">
              <Icon className="ns-check-circle" color="green" />
              Your phone number has been confirmed.
            </Header> */}
            {/* THIS HEADER WILL BE VISIBLE AFTER SUCCESS */}
            <Button primary size="large" className="very relaxed" content="Confirm" loading={!reSendVerificationCode && this.props.uiStore.inProgress} disabled={!ID_PHONE_VERIFICATION.meta.isValid} />
          </Form>
        </Modal.Content>
        {/* <Modal.Actions className="signup-actions">
          <Button type="button" className="link-button"
          content="Resend the code to my phone"
          loading={reSendVerificationCode && this.props.uiStore.inProgress}
          onClick={() => this.startPhoneVerification()} />
        </Modal.Actions> */}
      </Modal>
    );
  }
}
