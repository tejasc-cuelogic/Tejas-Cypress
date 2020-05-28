import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Button, Header, Grid, Form, Message } from 'semantic-ui-react';
import { ListErrors, NsModal } from '../../../theme/shared';
import formHOC from '../../../theme/form/formHOC';
import { FormValidator as Validator } from '../../../helper';


const isMobile = document.documentElement.clientWidth < 768;
const metaInfo = {
  store: 'authStore',
  form: 'SIGNUP_FRM',
};
class InvestorSignup extends Component {
  constructor(props) {
    super(props);
    const { setDefaultPwdType, setUserRole } = this.props.authStore;
    setDefaultPwdType();
    const userRoleData = cookie.load('ROLE_VALUE');
    setUserRole(userRoleData || 'investor');
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleIsEmailExist = (email) => {
    this.props.authStore.checkEmailExistsPresignup(email);
  }

  handlePassword = (e, result) => {
    this.props.authStore.signupChange(e, result);
    this.props.authStore.setVerifyPassword(e);
  }

  handleSubmitForm = async (e) => {
    e.preventDefault();
    const { authStore, uiStore, history, identityStore } = this.props;
    if (authStore.newPasswordRequired) {
      history.push('/change-password');
    } else {
      const { email, password, givenName } = Validator.ExtractValues(authStore.SIGNUP_FRM.fields);
      uiStore.setProgress();
      const res = await authStore.checkEmailExistsPresignup(email);
      if (res) {
        uiStore.setProgress(false);
        authStore.setCredentials({
          email,
          password,
          givenName,
        });
        if (authStore.SIGNUP_FRM.meta.isValid) {
          const result = await identityStore.sendOtpEmail(isMobile);
          if (result) {
            history.push('/confirm-email');
          }
        }
      }
    }
  };

  render() {
    const { smartElement } = this.props;
    const {
      SIGNUP_FRM,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const isDisabled = !([undefined, ''].includes(SIGNUP_FRM.fields.email.error)) || !SIGNUP_FRM.meta.isValid;
    const customError = errors && errors.code === 'UsernameExistsException'
      ? 'An account with the given email already exists, Please login if already registered.' : errors && errors.message;
    return (
      <NsModal
        open
        closeOnDimmerClick={false}
        onClose={
          () => {
            this.props.authStore.resetForm('SIGNUP_FRM');
            this.props.history.push(this.props.uiStore.authRef || '/');
          }
        }
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        back="/register"
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h3" className="mb-40">
              Sign up as an investor
              {/* <Link to="/register" className={`back-link ${inProgress ? 'disabled' : ''}`}><Icon className="ns-arrow-left" /></Link> */}
            </Header>
            <Form error onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
            </Form.Group>
            {smartElement.Input('email')}
            {smartElement.FormPasswordStrength('password',
              {
                changed: (e, result) => this.handlePassword(e, result),
                userInputs: [SIGNUP_FRM.fields.givenName.value],
              })}
            {errors
              && (
                <Message error textAlign="left" className="mt-30">
                  <ListErrors errors={[customError]} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" data-cy="investor-signup" content="Register" loading={inProgress} disabled={isDisabled || inProgress} />
            </div>
            <p className="mt-40">Already have an account? <Link to="/login">Log in</Link></p>

          </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
export default inject('authStore', 'uiStore', 'identityStore')(withRouter(formHOC(observer(InvestorSignup), metaInfo)));
