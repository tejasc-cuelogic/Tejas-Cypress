/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ReactCodeInput from 'react-code-input';
import { get } from 'lodash';
import { Button, Header, Form, Divider, Message, Grid } from 'semantic-ui-react';
import { ListErrors, NsModal } from '../../../theme/shared';
import Helper from '../../../helper/utility';
import ManageMultiFactorAuth from './settings/components/profileSettings/ManageMultiFactorAuth';
import { FormInput } from '../../../theme/form';


const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore')
@withRouter
@observer
export default class ConfirmOTPModal extends Component {
  state = {
    changeMfa: false,
  };

  componentDidMount() {
    Helper.otpShield();
  }

  handleChangeMfa = () => {
    this.setState({ changeMfa: true });
  }

  getMaskedPhoneNumber = () => {
    const number = this.props.maskedPhoneNumber;
    return number ? `XXX - XXX - ${number.substr(number.length - 4)}` : '';
  }

  getOTPEmailAddress = () => this.props.otpConfirmemailAddress;

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.push(this.props.refLinkListVal);
  }

  render() {
    const { props } = this;
    const {
      OTPVerifyMeta,
      VerificationChange,
    } = props.OTPData;
    const {
      actionToPerform,
      reSendVerificationCode,
      resendVerification,
      formSubmit,
      mfaMode,
    } = props;
    const { errors } = this.props.uiStore;
    const headerMessageToShow = actionToPerform;
    const formattedPhoneNumber = get(this.props, 'maskedPhoneNumber') ? Helper.phoneNumberFormatter(this.props.maskedPhoneNumber) : '';
    if (this.state.changeMfa) {
      return <ManageMultiFactorAuth refLink={this.props.match.url} {...this.props} />;
    }
    return (
      <NsModal open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={10} computer={8} className="pt-0">
            <Header as="h3">Please confirm with the code</Header>
            <Divider section className="small" />
            <p>
              To proceed with <b>{headerMessageToShow}</b> please
            check the verification code in the message we sent to:
          </p>
            {['TEXT', 'CALL', 'PHONE'].includes(mfaMode)
              ? <p className="display-only">{formattedPhoneNumber}</p>
              : (
                <FormInput
                  ishidelabel
                  type="email"
                  size="huge"
                  name="email"
                  fielddata={{ value: this.getOTPEmailAddress() }}
                  readOnly
                  displayMode
                  className="display-only"
                />
              )
            }
            <p>
              <Button color="green" className="link-button mt-30" content="See Multi-Factor Authentication Settings" onClick={this.handleChangeMfa} />
            </p>
            <Form error onSubmit={formSubmit}>
              <Form.Field className="otp-wrap">
                <label>Enter verification code here:</label>
                <ReactCodeInput
                  filterChars
                  fields={6}
                  type="number"
                  autocomplete="one-time-code"
                  className="otp-field"
                  autoFocus={!isMobile}
                  pattern="[0-9]*"
                  inputmode="numeric"
                  fielddata={OTPVerifyMeta.fields.code}
                  onChange={VerificationChange}
                />
                <Button type="button" size="small" color="grey" className="link-button green-hover" content="Resend code" onClick={e => resendVerification(e)} />
              </Form.Field>
              {errors
                && (
                  <Message error className="mb-40">
                    <ListErrors errors={[errors]} />
                  </Message>
                )
              }
              <Button type="submit" primary size="large" className="very relaxed" content="Confirm" loading={!reSendVerificationCode && this.props.uiStore.inProgress} disabled={!OTPVerifyMeta.meta.isValid || this.props.uiStore.inProgress} />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
