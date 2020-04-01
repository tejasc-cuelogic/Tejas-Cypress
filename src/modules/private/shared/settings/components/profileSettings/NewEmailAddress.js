import React from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Button, Form, Message, Divider } from 'semantic-ui-react';
import { ListErrors, NsModal } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import formHOC from '../../../../../../theme/form/formHOC';

const isMobile = document.documentElement.clientWidth < 768;

const metaInfo = {
  store: 'authStore',
  form: 'CONFIRM_FRM',
};
function NewEmailAddress(props) {
  const { authStore, identityStore, uiStore, history, refLink } = props;
  const handleChangeEmailAddress = async () => {
    const res = await identityStore.sendOtp('EMAIL_CHANGE', isMobile);
    if (res) {
      uiStore.clearErrors();
      identityStore.setIsOptConfirmed(false);
      Helper.toast('Email Change request has been accepted', 'success');
      const { email, password } = authStore.CONFIRM_FRM.fields;
      sessionStorage.setItem('changedEmail', email.value);
      authStore.setCredentials({
        email: email.value.toLowerCase(), password: password.value,
      });
      history.push(`${refLink}/confirm-email-address`);
    }
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    props.uiStore.clearErrors();
    props.authStore.resetForm('CONFIRM_FRM');
    sessionStorage.removeItem('changedEmail');
    props.history.push(props.refLink);
  };

  const { CONFIRM_FRM } = props.authStore;
  const { smartElement } = props;
  const { errors } = props.uiStore;
  if (props.uiStore.authWizardStep === 'ConfirmEmailAddress') {
    return null;
  }
  return (
    <NsModal
      closeOnDimmerClick={false}
      open
      closeIcon
      onClose={handleCloseModal}
      headerLogo
      borderedHeader
      isProgressHeaderDisable
    >
      <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
        <Grid.Column mobile={16} tablet={10} computer={8} className="pt-0">
          <Header as="h3">Enter new email address</Header>
          <p>We will send you a verification code to the email address you provide.</p>
          <Divider hidden />
          <Form error onSubmit={handleChangeEmailAddress}>
            {smartElement.Input('email', { showerror: true })}
            {errors
              && (
                <Message error className="mt-30">
                  <ListErrors errors={[errors.message]} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button primary size="large" className="very relaxed" content="Change Email Address" disabled={typeof CONFIRM_FRM.fields.email.error !== 'undefined' || isEmpty(CONFIRM_FRM.fields.email.value) || props.uiStore.inProgress} loading={props.uiStore.inProgress} />
            </div>
          </Form>
        </Grid.Column>
      </Grid>
    </NsModal>
  );
}
export default inject('authStore', 'uiStore', 'identityStore')(withRouter(formHOC(observer(NewEmailAddress), metaInfo)));
