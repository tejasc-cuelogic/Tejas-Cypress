/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { MaskedInput2 } from '../../../theme/form';
import Helper from '../../../helper/utility';
import { ListErrors } from '../../../theme/shared';

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    if (this.props.identityStore.ID_VERIFICATION_FRM.fields.phoneNumber.value === '') {
      if (this.props.userDetailsStore.userDetails.contactDetails &&
        this.props.userDetailsStore.userDetails.contactDetails.phone) {
        const fieldValue = this.props.userDetailsStore.userDetails.contactDetails.phone.number;
        this.props.identityStore.phoneNumberChange(fieldValue);
      }
    }
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
    this.props.identityStore.setReSendVerificationCode(true);
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
      ID_PHONE_VERIFICATION,
      personalInfoMaskedChange,
      phoneVerificationChange,
      reSendVerificationCode,
    } = this.props.identityStore;
    const { errors, editMode } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your phone number</Header>
          <Divider />
          <p> Please confirm the 6-digit verification code
              sent by text to your phone number:
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form>
            <MaskedInput2
              hidelabel
              value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
              type="tel"
              name="phoneNumber"
              fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
              format="###-###-####"
              readOnly={!editMode}
              changed={personalInfoMaskedChange}
              containerclassname="display-only"
              className="display-only"
              phoneNumber
            />
          </Form>
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
            </Form.Field>
            <Button.Group vertical>
              <Button loading={!reSendVerificationCode && this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!ID_PHONE_VERIFICATION.meta.isValid}>Confirm</Button>
              <Button loading={reSendVerificationCode && this.props.uiStore.inProgress} type="button" className="link-button cancel-link" onClick={() => this.startPhoneVerification()}>Resend the code to my phone</Button>
            </Button.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
