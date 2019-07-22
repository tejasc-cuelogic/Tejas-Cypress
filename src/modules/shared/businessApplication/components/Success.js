import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button, Form, Loader, Dimmer, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { FormInput, FormPasswordStrength } from '../../../../theme/form';
import { ListErrors } from '../../../../theme/shared';
import { authActions } from '../../../../services/actions';
import Helper from '../../../../helper/utility';

@inject('businessAppStore', 'authStore', 'userStore', 'uiStore')
@withRouter
@observer
class Success extends Component {
  state = {
    showProgressLoader: false,
  }

  componentWillMount() {
    if (this.props.isPublic) {
      const { fields } = this.props.businessAppStore.BUSINESS_APP_FRM_BASIC;
      if (fields.email.value === '') {
        const { id, applicationType } = this.props.match.params;
        this.props.businessAppStore.fetchPreQualAppDataById(id).then((data) => {
          const fieldData = {};
          fieldData.email = { value: data.email };
          fieldData.firstName = { value: data.firstName };
          fieldData.lastName = { value: data.lastName };
          this.props.authStore.setUserDetails(fieldData);
          this.props.businessAppStore.setFieldvalue('applicationId', data.id);
          this.props.businessAppStore.setFieldvalue('currentApplicationType', applicationType);
        });
      } else {
        this.props.authStore.setUserDetails(fields);
      }
    }
    this.props.uiStore.setFieldvalue('authRef', this.props.match.url);
    this.props.uiStore.setFieldvalue('isFromBusinessApplication', true);
  }

  onProceed = (e) => {
    e.preventDefault();
    const {
      userExists, currentApplicationType, applicationId, setFieldvalue,
    } = this.props.businessAppStore;
    this.props.businessAppStore.setFieldvalue('showUserError', false);
    if (this.props.isPublic) {
      this.setState({ showProgressLoader: true });
      if (!userExists) {
        authActions.register()
          .then(() => {
            const { email, password } = this.props.authStore.SIGNUP_FRM.fields;
            this.props.authStore.setCredentials({ email: email.value, password: password.value });
            this.props.authStore.setUserLoginDetails(email.value, password.value);
            this.props.authStore.portPrequalDataToApplication(applicationId)
              .then((appId) => {
                setFieldvalue('applicationId', appId);
                this.proceedLoginIn(currentApplicationType, appId);
              })
              .catch((er) => {
                this.setState({ showProgressLoader: false });
                Helper.toast(er.message, 'error');
              });
          })
          .catch((er) => {
            this.setState({ showProgressLoader: false });
            Helper.toast(er.message, 'error');
          });
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
        this.setState({ showProgressLoader: false });
        const roles = get(this.props.userStore, 'currentUser.roles');
        this.props.authStore.resetForm('LOGIN_FRM');
        if (roles && roles.includes('issuer')) {
          const redirectUrl = `/app/business-application/${currentApplicationType}/${applicationId}/business-details`;
          this.props.history.push(redirectUrl);
        } else {
          this.props.businessAppStore.setFieldvalue('showUserError', true);
          this.props.businessAppStore.setFieldvalue('userExists', false);
        }
      }).catch(() => {
        this.setState({ showProgressLoader: false });
      }).finally(() => {
        this.props.uiStore.setFieldvalue('authRef', null);
        this.props.uiStore.setFieldvalue('isFromBusinessApplication', false);
        this.props.uiStore.removeOneFromProgressArray('login');
      });
  }

  render() {
    const {
      signupChange, togglePasswordType, SIGNUP_FRM,
      LoginChange, LOGIN_FRM, pwdInputType, currentScore,
    } = this.props.authStore;
    const { userExists, userRoles } = this.props.businessAppStore;
    const { fields } = SIGNUP_FRM;
    const { errors } = this.props.uiStore;
    return (
      <>
        <Grid container>
          <Grid.Column className="issuer-signup">
            <Icon className="ns-paper-plane" size="massive" color="green" />
            <Header as="h1">Congratulations!</Header>
            <p>
              <b>You have been prequalified for a NextSeed campaign.</b>
            </p>
            <p>
              {!userExists || !this.props.isPublic
                ? `Please begin filling out the rest of the application and
                submitting the necessary paperwork. Our step-by-step guide
                will take you through the steps and keep the process organized.`
                : `Please log in to finish filling out the rest of the application
                and submitting the necessary paperwork. Our step-by-step guide
                will walk you through the steps and keep the process organized.`
              }
            </p>
            {userExists && userRoles.includes('issuer')
              && <h3 className="ui header">Log In</h3>
            }
            {this.props.isPublic
              && (
                <Form error>
                <Grid>
                  <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                    {!userExists || !userRoles.includes('issuer')
                      ? ['email', 'password', 'verify'].map(field => (
                        (field === 'password')
                          ? (
                              <FormPasswordStrength
                                key="password"
                                name="password"
                                type="password"
                                userInputs={[fields.email.value]}
                                iconDisplay
                                minLength={8}
                                minScore={4}
                                tooShortWord="Weak"
                                scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
                                inputProps={{ name: 'password', autoComplete: 'off', placeholder: 'Password' }}
                                changed={signupChange}
                                fielddata={fields[field]}
                              />
                          )
                          : (
                            <>
                              <FormInput
                                key={field}
                                readOnly={field === 'email' && userRoles.includes('issuer')}
                                type={field !== 'email' ? pwdInputType : 'text'}
                                name={field}
                                fielddata={fields[field]}
                                changed={signupChange}
                              />
                              {field === 'email' && userRoles.length ? (
                                <p className="negative-text">
                                  {`This email is already registered as an ${userRoles}.  Please enter a new email address.`}
                                </p>
                              ) : ''}
                            </>
                          )
                      ))
                      : (
                        <>
                          {['email', 'password'].map(field => (
                            <FormInput
                              key={field}
                              icon={field === 'password' ? togglePasswordType(field) : null}
                              type={field === 'password' ? pwdInputType : 'text'}
                              name={field}
                              readOnly={field === 'email'}
                              fielddata={LOGIN_FRM.fields[field]}
                              changed={LoginChange}
                            />
                          ))}
                        <Form.Field>
                          <Link to="/forgot-password">Forgot password?</Link>
                        </Form.Field>
                        </>
                      )
                    }
                    {errors
                      && (
                      <Message error className="mt-30">
                        <ListErrors errors={[errors.message]} />
                      </Message>
                      )
                    }
                  </Grid.Column>
                </Grid>
              </Form>
              )
            }
            <Divider section hidden />
            <Button primary size="large" className="very relaxed" content="Proceed" loading={this.props.uiStore.inProgress} onClick={this.onProceed} disabled={(this.props.isPublic && (!SIGNUP_FRM.meta.isValid || !currentScore) && !userExists)} />
          </Grid.Column>
        </Grid>
        {this.state.showProgressLoader
        && (
        <Dimmer active className="fullscreen">
          <Loader size="large">
            <Header as="h3">
              Please wait...
              <Header.Subheader>
                We are processing your business application.
              </Header.Subheader>
            </Header>
          </Loader>
        </Dimmer>
        )
        }
      </>
    );
  }
}

export default Success;
