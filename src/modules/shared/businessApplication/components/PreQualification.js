import React, { Component } from 'react';
import { get, has } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Form, Button, Divider } from 'semantic-ui-react';
import queryString from 'query-string';
import scrollIntoView from 'scroll-into-view';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../helper/utility';
import { FormInput } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import PreQualBusiness from './prequlification/PreQualBusiness';
import PreQualRealEstate from './prequlification/PreQualRealEstate';
import NotFound from '../../NotFound';
import { DataFormatter } from '../../../../helper';
import { authActions } from '../../../../services/actions';

const isMobile = document.documentElement.clientWidth < 768;
@inject('businessAppStore', 'uiStore', 'authStore')
@withRouter
@observer
export default class PreQualification extends Component {
  constructor(props) {
    super(props);
    if (this.props.isPublic) {
      const { params } = this.props.match;
      const urlParameter = queryString.parse(this.props.location.search);
      if (urlParameter) {
        if (get(urlParameter, 'signupCode') || get(urlParameter, 'signupcode') || get(urlParameter, 'sc')) {
          window.localStorage.setItem('signupCode', get(urlParameter, 'signupCode') || get(urlParameter, 'signupcode') || get(urlParameter, 'sc'));
        }
        if (get(urlParameter, 'utmSource') || get(urlParameter, 'utmsource') || get(urlParameter, 'utm_source')) {
          const utmSource = get(urlParameter, 'utmSource') || get(urlParameter, 'utmsource') || get(urlParameter, 'utm_source');
          window.localStorage.setItem('utmSource', has(urlParameter, 'adid') ? `${utmSource}&&adid=${urlParameter.adid}` : utmSource);
        }
      }
      this.props.businessAppStore.formReset(params.applicationType);
      this.props.businessAppStore.setFieldvalue('currentApplicationType', params.applicationType);
    }
  }

  submit = (e) => {
    e.preventDefault();
    if (this.props.isPublic) {
      this.props.businessAppStore.businessPreQualificationFormSumbit()
        .then(() => {
          this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
          const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
          Helper.toast('Business pre-qualification request submitted!', 'success');
          this.props.history.push(`/business-application/${url}`);
        });
    } else {
      this.props.businessAppStore.setPrequalBasicDetails();
      this.props.businessAppStore.businessPreQualificationBasicFormSumbit(false)
        .then(() => {
          this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
          this.props.businessAppStore.businessPreQualificationFormSumbit()
            .then((isPublicUrl) => {
              const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
              Helper.toast('Business pre-qualification request submitted!', 'success');
              this.props.history.push(`${isPublicUrl ? '' : '/app'}/business-application/${url}`);
            });
        });
    }
  }

  prequalBasicSubmit = (e) => {
    e.preventDefault();
    const { params } = this.props.match;
    const { BUSINESS_APP_FRM_BASIC, BUSINESS_ACCOUNT, currentApplicationType } = this.props.businessAppStore;
    if (this.props.isPublic) {
      this.props.authStore.checkEmailExistsPresignup(BUSINESS_APP_FRM_BASIC.fields.email.value, true)
        .then(() => {
          if (!this.props.businessAppStore.userExists) {
            this.props.businessAppStore.businessPreQualificationBasicFormSumbit()
              .then(() => {
                this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
                const sel = params.applicationType === 'commercial-real-estate' ? 'cre-scroll'
                  : 'application-scroll';
                scrollIntoView(document.querySelector(`.${sel}`), { align: { top: 0, topOffset: params.applicationType === 'commercial-real-estate' ? 140 : 110 } });
              });
          } else if (this.props.businessAppStore.userExists && this.props.businessAppStore.userRoles.includes('issuer')) {
            this.props.authStore.setUserLoginDetails(BUSINESS_APP_FRM_BASIC.fields.email.value, BUSINESS_ACCOUNT.fields.password.value);
            if (BUSINESS_ACCOUNT.fields.password.value) {
              this.props.uiStore.setProgress();
              this.proceedLoginIn(currentApplicationType);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  proceedLoginIn = (currentApplicationType) => {
    authActions.login()
      .then(() => {
        this.props.authStore.resetForm('LOGIN_FRM');
        const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
        const redirectUrl = `/app/business-application/${currentApplicationType}/${url}`;
        this.props.history.push(redirectUrl);
        this.props.uiStore.setProgress(false);
      })
      .catch((error) => {
        this.props.uiStore.setProgress(false);
        console.log(error);
        Helper.toast(error.message, 'error');
      })
      .finally(() => {
        this.props.uiStore.setFieldvalue('authRef', null);
        this.props.uiStore.setFieldvalue('isFromBusinessApplication', false);
        this.props.uiStore.removeOneFromProgressArray('login');
      });
  }

  render() {
    const {
      BUSINESS_APP_FRM, BUSINESS_APP_FRM_BASIC, preQualFormDisabled, businessAppEleChange, userExists, userRoles,
      isPrequalQulify, currentApplicationType, fetchBusinessApplicationsDataById, BUSINESS_ACCOUNT,
    } = this.props.businessAppStore;
    const { hideFields, match } = this.props;
    const { params } = match;
    if (params.applicationType !== 'commercial-real-estate' && currentApplicationType !== 'commercial-real-estate' && params.applicationType !== 'business' && currentApplicationType !== 'business') {
      return <NotFound />;
    }
    return (
      <div className={hideFields ? 'inner-content-spacer' : 'ui container'}>
        <Form onSubmit={this.prequalBasicSubmit} className="issuer-signup">
          {!hideFields
          && (
          <>
            <Icon className="ns-paper-plane" size="massive" color="green" />
            <FormElementWrap
              as="h1"
              header="Pre-Qualification Application Process"
              subHeader={(
                <>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.
                  <Link to={this.props.isPublic ? '/business-application/questions/need-help' : 'need-help'} className="link">Need help or have questions?</Link>
                </>
)}
            />
          </>
          )
          }
          {this.props.isPublic
          && (
          <FormElementWrap header="First, please tell us a little about yourself!" hideFields={hideFields}>
            <div className="field-wrap">
              <Form.Group widths="equal">
                {
                  ['firstName', 'lastName', 'email'].map(field => (
                    <FormInput
                      autoFocus={field === 'firstName'}
                      readOnly={isPrequalQulify}
                      containerclassname={isPrequalQulify ? 'display-only' : ''}
                      key={field}
                      type="text"
                      asterisk="true"
                      name={field}
                      fielddata={BUSINESS_APP_FRM_BASIC.fields[field]}
                      changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_FRM_BASIC')}
                    />
                  ))
                }
                {userExists && userRoles.includes('issuer')
                  ? (
                    <>
                      <Form.Field>
                        <FormInput
                          readOnly={isPrequalQulify}
                          containerclassname={isPrequalQulify ? 'display-only' : ''}
                          key="password"
                          type="password"
                          asterisk="true"
                          name="password"
                          fielddata={BUSINESS_ACCOUNT.fields.password}
                          changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_ACCOUNT')}
                        />
                        <Link to="/forgot-password">Forgot password?</Link>
                      </Form.Field>
                    </>
                  )
                  : ''
                }
              </Form.Group>
            </div>
            {!isPrequalQulify
            && (
            <>
              <Divider hidden />
              <Button
                loading={this.props.uiStore.inProgress}
                disabled={!userExists ? !BUSINESS_APP_FRM_BASIC.meta.isValid : !(BUSINESS_APP_FRM_BASIC.meta.isValid && BUSINESS_ACCOUNT.fields.password.value !== '')}
                size="large"
                color="green"
                className="very relaxed"
              >
                Continue
              </Button>
            </>
            )
            }
          </FormElementWrap>
          )
          }
        </Form>
        {isPrequalQulify
        && (
          <Form onSubmit={this.submit} className="issuer-signup">
          {params.applicationType === 'commercial-real-estate' || currentApplicationType === 'commercial-real-estate'
            ? <PreQualRealEstate hideFields={hideFields} applicationType={params.applicationType} />
            : <PreQualBusiness hideFields={hideFields} applicationType={params.applicationType} />
          }
          {!hideFields
          && (
          <>
            <Divider hidden />
            {!preQualFormDisabled
              ? (
                <Button
                  loading={this.props.uiStore.inProgress}
                  disabled={!BUSINESS_APP_FRM.meta.isValid || (BUSINESS_APP_FRM.meta.isValid && this.props.uiStore.inProgress)}
                  size="large"
                  color="green"
                  className={`${isMobile && 'mb-50'} very relaxed`}
                >
                Submit
              </Button>
              )
              : fetchBusinessApplicationsDataById
              && (
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Submitted on {DataFormatter.getDateAsPerTimeZone(get(fetchBusinessApplicationsDataById, 'created.date'), true, false, false)}
              </Button>
              )
            }
          </>
          )
          }
        </Form>
        )
        }
      </div>
    );
  }
}
