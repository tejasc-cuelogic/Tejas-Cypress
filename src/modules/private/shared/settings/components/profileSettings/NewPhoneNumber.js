import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { Header, Modal, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput, FormRadioGroup } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class NewPhoneNumber extends Component {
  componentWillMount() {
    const { userDetailsStore, identityStore } = this.props;
    if (userDetailsStore.userDetails.phone && userDetailsStore.userDetails.phone.type) {
      identityStore.phoneTypeChange(userDetailsStore.userDetails.phone.type);
    } else {
      identityStore.phoneTypeChange('TEXT');
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_VERIFICATION_FRM');
  }
  handleChangePhoneNumber = () => {
    const { resetFormData, ID_VERIFICATION_FRM } = this.props.identityStore;
    resetFormData('ID_PHONE_VERIFICATION');
    const { phoneNumber, mfaMethod } = ID_VERIFICATION_FRM.fields;
    const phoneNumberValue = phoneNumber.value;
    const type = mfaMethod.value !== '' ? mfaMethod.value : 'NEW';
    this.props.identityStore.startPhoneVerification(type, phoneNumberValue, isMobile).then(() => {
      this.props.identityStore.setIsOptConfirmed(false);
      this.props.uiStore.clearErrors();
      this.props.history.push(`${this.props.refLink}/confirm`);
    })
      .catch(() => {});
  }
  render() {
    const {
      ID_VERIFICATION_FRM,
      personalInfoMaskedChange,
      personalInfoChange,
    } = this.props.identityStore;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Enter new phone number</Header>
          <p>We will send you a verification code to the phone number you provide.</p>
        </Modal.Header>
        <Modal.Content>
          <Form error onSubmit={this.handleChangePhoneNumber}>
            <MaskedInput
              name="phoneNumber"
              type="tel"
              fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
              format="(###) ###-####"
              changed={personalInfoMaskedChange}
              phoneNumber
            />
            <div className="field center-align">
              <Header as="label">{ID_VERIFICATION_FRM.fields.mfaMethod.label}</Header>
              <FormRadioGroup
                fielddata={ID_VERIFICATION_FRM.fields.mfaMethod}
                name="mfaMethod"
                containerclassname="mt-30 radio-basic center-align"
                widths="equal"
                changed={(e, result) => personalInfoChange(e, result)}
              />
            </div>
            {errors &&
              <Message error className="mt-20">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button primary size="large" className="very relaxed" content="Change Phone Number" loading={this.props.uiStore.inProgress} disabled={!!ID_VERIFICATION_FRM.fields.phoneNumber.error || isEmpty(ID_VERIFICATION_FRM.fields.phoneNumber.value)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
