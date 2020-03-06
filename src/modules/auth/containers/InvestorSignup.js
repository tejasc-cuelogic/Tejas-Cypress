import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { Modal, Button, Header, Icon, Form, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../theme/shared';
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
          identityStore.requestOtpWrapper(isMobile).then(() => {
            history.push('/confirm-email');
          });
        }
      }
    }
  };

  render() {
    const { smartElement } = this.props;
    const {
      SIGNUP_FRM, signupChange, currentScore,
    } = this.props.authStore;
    const { errors, inProgress, pwdInputType, responsiveVars } = this.props.uiStore;
    const isDisabled = !([undefined, ''].includes(SIGNUP_FRM.fields.email.error)) || !SIGNUP_FRM.meta.isValid || !currentScore;
    const customError = errors && errors.code === 'UsernameExistsException'
      ? 'An account with the given email already exists, Please login if already registered.' : errors && errors.message;
    return (
      <Modal
        size="mini"
        open
        closeOnDimmerClick={false}
        onClose={
          () => {
            this.props.authStore.resetForm('SIGNUP_FRM');
            this.props.history.push(this.props.uiStore.authRef || '/');
          }
        }
      >
        <Modal.Header className="center-align signup-header">
          <Header as="h3" className="mb-0">
            Sign up as an Investor
          </Header>
          <Link to="/register" className={`back-link ${inProgress ? 'disabled' : ''}`}><Icon className="ns-arrow-left" /></Link>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              {
                ['givenName', 'familyName'].map(field => (
                  smartElement.Input(field, { autoFocus: !responsiveVars.isMobile && field === 'givenName' })
                ))
              }

            </Form.Group>
            {smartElement.Input('email')}
            {smartElement.FormPasswordStrength('password',
              {
                changed: signupChange,
                userInputs: [SIGNUP_FRM.fields.givenName.value, `${SIGNUP_FRM.fields.givenName.value}${SIGNUP_FRM.fields.familyName.value}`,
                SIGNUP_FRM.fields.familyName.value, SIGNUP_FRM.fields.email.value],
              })}
            {smartElement.Input('verify', { type: pwdInputType })}
            {errors
              && (
                <Message error textAlign="left" className="mt-30">
                  <ListErrors errors={[customError]} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button fluid primary size="large" className="very relaxed" content="Register" loading={inProgress} disabled={isDisabled || inProgress} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Already have an account?</b> <Link to="/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default inject('authStore', 'uiStore', 'identityStore')(withRouter(formHOC(observer(InvestorSignup), metaInfo)));
