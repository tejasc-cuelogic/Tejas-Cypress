import React, { Component } from 'react';
import { Grid, Icon, Header, Divider, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies';
import { FormInput, FormPasswordStrength } from '../../../../theme/form';
import { authActions } from '../../../../services/actions';
import Helper from '../../../../helper/utility';

@inject('businessAppStore', 'authStore', 'userStore', 'uiStore')
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
    const {
      userExists, currentApplicationType, applicationId, setFieldvalue,
    } = this.props.businessAppStore;
    if (this.props.isPublic) {
      if (!userExists) {
        authActions.register()
          .then(() => {
            const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
            const userCredentials = { email: email.value, password: btoa(password.value) };
            cookie.save('USER_CREDENTIALS', userCredentials, { maxAge: 1200 });
            this.props.authStore.setUserLoginDetails(email.value, password.value);
            this.props.authStore.portPrequalDataToApplication(applicationId)
              .then((appId) => {
                setFieldvalue('applicationId', appId);
                this.proceedLoginIn(currentApplicationType, appId);
              })
              .catch(er => Helper.toast(er.message, 'error'));
          })
          .catch(er => Helper.toast(er.message, 'error'));
      } else {
        this.proceedLoginIn(currentApplicationType, applicationId);
      }
    } else {
      this.props.history.push(`${this.props.refLink}/business-details`);
    }
  }

  proceedLoginIn = (currentApplicationType, applicationId) => {
    authActions.login()
      .then(() => {
        const { roles } = this.props.userStore.currentUser;
        this.props.authStore.resetForm('LOGIN_FRM');
        if (roles && roles.includes('issuer')) {
          const redirectUrl = `/app/business-application/${currentApplicationType}/${applicationId}/business-details`;
          this.props.history.push(redirectUrl);
        }
      });
  }

  render() {
    const {
      signupChange, togglePasswordType, SIGNUP_FRM, LoginChange, LOGIN_FRM, pwdInputType,
    } = this.props.authStore;
    const { userExists } = this.props.businessAppStore;
    const { fields } = SIGNUP_FRM;
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
                  {!userExists ?
                    ['email', 'password', 'verify'].map(field => (
                      (field === 'password') ?
                        <FormPasswordStrength
                          key="password"
                          name="password"
                          type="password"
                          iconDisplay
                          minLength={8}
                          minScore={4}
                          tooShortWord="Weak"
                          scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
                          inputProps={{ name: 'password', autoComplete: 'off', placeholder: 'Password' }}
                          changed={signupChange}
                          fielddata={fields[field]}
                        />
                        :
                        <FormInput
                          key={field}
                          disabled={field === 'email'}
                          // icon={field !== 'email' ? togglePasswordType(field) : null}
                          type={field !== 'email' ? pwdInputType : 'text'}
                          name={field}
                          fielddata={fields[field]}
                          changed={signupChange}
                        />
                    )) :
                    ['email', 'password'].map(field => (
                      <FormInput
                        key={field}
                        icon={field === 'password' ? togglePasswordType(field) : null}
                        type={field === 'password' ? pwdInputType : 'text'}
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
          <Button loading={this.props.uiStore.inProgress} onClick={this.onProceed} disabled={(this.props.isPublic && !SIGNUP_FRM.meta.isValid && !userExists)} size="large" color="green" className="very relaxed">Proceed</Button>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Success;
