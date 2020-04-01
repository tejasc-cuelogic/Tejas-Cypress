import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Divider, Button, Message, Grid } from 'semantic-ui-react';
import { MaskedInput } from '../../../theme/form';
import { ListErrors, NsModal } from '../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('identityStore', 'uiStore')
@withRouter
@observer
export default class MigratedUserPhoneNumber extends Component {
  constructor(props) {
    super(props);
    const {
      personalInfoMaskedChange,
      ID_VERIFICATION_FRM,
    } = this.props.identityStore;
    const { value } = ID_VERIFICATION_FRM.fields.phoneNumber;
    personalInfoMaskedChange({ value }, 'phoneNumber', 'ID_VERIFICATION_FRM');
    // validateForm('ID_VERIFICATION_FRM');
  }

  handlePhoneNumberConfirmation = async () => {
   const res = await this.props.identityStore.sendOtp('PHONE_CONFIGURATION', isMobile);
    if (res) {
      this.props.identityStore.setConfirmMigratedUserPhoneNumber(true);
    }
  }

  handleCloseModal = () => {
    this.props.history.push('/dashboard/setup');
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_VERIFICATION_FRM');
  }

  render() {
    const { ID_VERIFICATION_FRM, personalInfoMaskedChange } = this.props.identityStore;
    const { errors } = this.props.uiStore;
    return (
      <NsModal
        open
        closeIcon
        onClose={this.handleCloseModal}
        closeOnRootNodeClick={false}
        closeOnDimmerClick={false}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3">Confirm your phone number</Header>
            <p>
              {`We're introducing Multi-Factor Authentication (MFA) to
              increase the security of your NextSeed account`}
            </p>
            <Divider hidden />
            <p>We will send you a verification code to the phone number you enter below</p>
            <Form onSubmit={this.handlePhoneNumberConfirmation}>
              <MaskedInput
                hidelabel
                value={ID_VERIFICATION_FRM.fields.phoneNumber.value}
                type="tel"
                name="phoneNumber"
                fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                className="display-only  no-border"
                phoneNumberDisplayMode
                showerror
              />
              <Divider hidden />
              <p className="note">
                By selecting <b>Confirm</b>, you agree NextSeed may deliver verification codes
                to you using the phone number you have provided. Codes may be sent using text
                messages, an autodialer, or artificial or prerecorded voice messages to such
                phone number. Your mobile carrier’s messaging and data fees may apply.
              </p>
              <Divider hidden />
              <Button disabled={!(ID_VERIFICATION_FRM.fields.phoneNumber.value !== '' && ID_VERIFICATION_FRM.fields.phoneNumber.error === undefined)} primary fluid={isMobile} content="Confirm" loading={this.props.uiStore.inProgress} />
            </Form>
            {errors
              && (
                <Message error textAlign="left" className="mb-30">
                  <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                </Message>
              )
            }
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
