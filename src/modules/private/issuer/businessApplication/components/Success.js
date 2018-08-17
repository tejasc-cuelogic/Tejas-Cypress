import React, { Component } from 'react';
import { Grid, Icon, Header, Divider, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { FormInput } from '../../../../../theme/form';
import { authActions } from '../../../../../services/actions';

@inject('businessAppStore', 'authStore', 'userStore')
@observer
class Success extends Component {
  componentWillMount() {
    if (this.props.isPublic) {
      const { fields } = this.props.businessAppStore.BUSINESS_APP_FRM_BASIC;
      this.props.authStore.setUserDetails(fields);
    }
  }
  onProceed = (e) => {
    e.preventDefault();
    if (this.props.isPublic) {
      const { fields } = this.props.businessAppStore.BUSINESS_APP_FRM_BASIC;
      if (fields.email.value !== 'chetan.bura@cuelogic.com') {
        authActions.register()
          .then(() => {
            if (this.props.authStore.newPasswordRequired) {
              this.props.history.push('/auth/change-password');
            } else {
              const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
              const userCredentials = { email: email.value, password: btoa(password.value) };
              cookie.save('USER_CREDENTIALS', userCredentials, { maxAge: 1200 });
              this.props.history.push('/auth/confirm-email');
            }
          })
          .catch(() => { });
      } else {
        authActions.login()
          .then(() => {
            const { roles } = this.props.userStore.currentUser;
            if (this.props.authStore.newPasswordRequired) {
              this.props.history.push('/auth/change-password');
            } else {
              this.props.authStore.reset();
              if (roles && !roles.includes('investor')) {
                const redirectUrl = '/app/business-application/58a5bc40-a1fb-11e8-b93e-9b2c4fb7f46e/business-details';
                this.props.history.push(redirectUrl);
              }
            }
          });
      }
    } else {
      this.props.history.push(`${this.props.refLink}/business-details`);
    }
  }
  render() {
    const {
      signupChange, SIGNUP_FRM, LoginChange, LOGIN_FRM, togglePasswordType, pwdInputType,
    } = this.props.authStore;
    const { fields } = SIGNUP_FRM;
    const isNewUser = fields.email.value !== 'chetan.bura@cuelogic.com';
    return (
      <Grid container>
        <Grid.Column className="issuer-signup">
          <Icon className="ns-paper-plane" size="massive" color="green" />
          <Header as="h1">Congratulations!</Header>
          <p>
            <b>You have been pre-qualified for a NextSeed campaign.</b>
          </p>
          <p>
          In the meantime, please begin filling out the rest of the application and submitting the
          necessary paperwork. Our step-by-step guide will walk you through the steps and keep
          the process organized.
          </p>
          {this.props.isPublic &&
          <Form>
            <Grid>
              <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                {isNewUser ?
                  ['password', 'verify'].map(field => (
                    <FormInput
                      key={field}
                      type={pwdInputType[field]}
                      icon={togglePasswordType(field)}
                      name={field}
                      fielddata={fields[field]}
                      changed={signupChange}
                    />
                  )) :
                  ['email', 'password'].map(field => (
                    <FormInput
                      key={field}
                      icon={field === 'password' ? togglePasswordType(field) : null}
                      type={field === 'password' ? pwdInputType[field] : 'text'}
                      name={field}
                      disabled={field === 'email'}
                      fielddata={LOGIN_FRM.fields[field]}
                      changed={LoginChange}
                    />
                  ))
                }
              </Grid.Column>
            </Grid>
          </Form>
          }
          <Divider section hidden />
          <Button onClick={this.onProceed} disabled={(this.props.isPublic && !SIGNUP_FRM.meta.isValid && isNewUser)} size="large" color="green" className="very relaxed">Proceed</Button>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Success;
