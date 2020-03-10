import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Button, Form, Message, Divider } from 'semantic-ui-react';
import { ListErrors, NsModal } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import { FormInput } from '../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('authStore', 'uiStore', 'identityStore')
@withRouter
@observer
export default class NewEmailAddress extends Component {
  handleChangeEmailAddress = () => {
    this.props.authStore.requestEmailChange().then(() => {
      this.props.uiStore.clearErrors();
      this.props.identityStore.setIsOptConfirmed(false);
      Helper.toast('Email Change request has been accepted', 'success');
      const { email, password } = this.props.authStore.CONFIRM_FRM.fields;
      sessionStorage.setItem('changedEmail', email.value);
      this.props.authStore.setCredentials({
        email: email.value.toLowerCase(), password: password.value,
      });
      this.props.history.push(`${this.props.refLink}/confirm-email-address`);
    })
      .catch(() => { });
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.uiStore.clearErrors();
    this.props.authStore.resetForm('CONFIRM_FRM');
    sessionStorage.removeItem('changedEmail');
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { CONFIRM_FRM, confirmFormChange } = this.props.authStore;
    const { errors } = this.props.uiStore;
    if (this.props.uiStore.authWizardStep === 'ConfirmEmailAddress') {
      return null;
    }
    return (
      <NsModal
        closeOnDimmerClick={false}
        open
        closeIcon
        onClose={this.handleCloseModal}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h3">Enter new email address</Header>
            <p>We will send you a verification code to the email address you provide.</p>
            <Divider hidden />
            <Form error onSubmit={this.handleChangeEmailAddress}>
              <FormInput
                fluid
                label="Email"
                placeholder="Email address"
                name="email"
                fielddata={CONFIRM_FRM.fields.email}
                changed={confirmFormChange}
                showerror
              />
              {errors
                && (
                  <Message error className="mt-30">
                    <ListErrors errors={[errors.message]} />
                  </Message>
                )
              }
              <Button primary size="large" className="mt-30" content="Change Email Address" disabled={typeof CONFIRM_FRM.fields.email.error !== 'undefined' || isEmpty(CONFIRM_FRM.fields.email.value) || this.props.uiStore.inProgress} loading={this.props.uiStore.inProgress} />
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
