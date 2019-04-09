import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Form, Divider, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../theme/form';
import { ListErrors } from '../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('identityStore', 'uiStore')
@withRouter
@observer
export default class MigratedUserPhoneNumber extends Component {
  componentWillMount() {
    const {
      personalInfoMaskedChange,
      ID_VERIFICATION_FRM,
    } = this.props.identityStore;
    const { value } = ID_VERIFICATION_FRM.fields.phoneNumber;
    personalInfoMaskedChange({ value }, 'phoneNumber');
    // validateForm('ID_VERIFICATION_FRM');
  }
  handlePhoneNumberConfirmation = () => {
    const { ID_VERIFICATION_FRM } = this.props.identityStore;
    // this.props.identityStore.setConfirmMigratedUserPhoneNumber(true);
    const { phoneNumber } = ID_VERIFICATION_FRM.fields;
    const phoneNumberValue = phoneNumber.value;
    this.props.identityStore.startPhoneVerification('NEW', phoneNumberValue, isMobile);
  }
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_VERIFICATION_FRM');
  }
  render() {
    const { ID_VERIFICATION_FRM, personalInfoMaskedChange } = this.props.identityStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.handleCloseModal()} closeOnRootNodeClick={false} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Confirm your phone number</Header>
          <p>
            {`We're introducing Multi-Factor Authentication (MFA) to
            increase the security of your NextSeed account`}
          </p>
          <Divider section />
          <p>We will send you a verification code to the phone number you enter below</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <Form onSubmit={this.handlePhoneNumberConfirmation}>
            <MaskedInput
              hidelabel
              value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
              type="tel"
              name="phoneNumber"
              fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
              format="(###) ###-####"
              changed={personalInfoMaskedChange}
              className="display-only"
              phoneNumberDisplayMode
              showerror
            />
            <Divider hidden />
            <Button disabled={!(ID_VERIFICATION_FRM.fields.phoneNumber.value !== '' && ID_VERIFICATION_FRM.fields.phoneNumber.error === undefined)} primary size="large" className="very relaxed" content="Confirm" loading={this.props.uiStore.inProgress} />
          </Form>
          { errors &&
            <Message error textAlign="left" className="mb-30">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          }
        </Modal.Content>
      </Modal>
    );
  }
}
