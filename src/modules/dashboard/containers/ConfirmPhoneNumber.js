import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Message } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../components/form/FormElements';

import Helper from '../../../helper/utility';
import ListErrors from '../../../components/common/ListErrors';

@inject('profileStore', 'uiStore')
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.profileStore.confirmPhoneNumber().then(() => {
      Helper.toast('Phone number is confirmed.', 'success');
      this.props.setDashboardWizardStep();
    });
  }

  render() {
    const {
      verifyIdentity01,
      verifyIdentity04,
      verifyVerificationCodeChange,
    } = this.props.profileStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          {errors &&
            <Message error textAlign="left">
              <ListErrors errors={[errors.message]} />
            </Message>
          }
          <MaskedInput
            value={verifyIdentity01.fields.phoneNumber.value}
            type="tel"
            name="phoneNumber"
            fielddata={verifyIdentity01.fields.phoneNumber}
            mask="999-999-9999"
            readOnly
            hidelabel
            className="display-only"
          />
          <p><Link to="/app/dashboard" >Change phone number</Link></p>
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
              <Button loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed" disabled={!verifyIdentity04.meta.isValid}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.profileStore.startPhoneVerification()}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
