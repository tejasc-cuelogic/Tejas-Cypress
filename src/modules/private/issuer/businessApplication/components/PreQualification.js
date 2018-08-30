import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Icon, Form, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../helper/utility';
import { FormInput } from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import PreQualBusiness from './prequlification/PreQualBusiness';
import PreQualRealEstate from './prequlification/PreQualRealEstate';
import NotFound from '../../../../shared/NotFound';

@inject('businessAppStore', 'uiStore')
@withRouter
@observer
export default class PreQualification extends Component {
  componentWillMount() {
    if (this.props.isPublic) {
      this.props.businessAppStore.formReset();
    }
  }
  submit = (e) => {
    e.preventDefault();
    if (this.props.isPublic) {
      const { fields } = this.props.businessAppStore.BUSINESS_APP_FRM;
      if (fields.businessName.value === 'success') {
        this.props.history.push('/business-application/12345678/success');
      } else if (fields.businessName.value === 'failed') {
        this.props.history.push('/business-application/12345678/failed');
      } else if (fields.businessName.value === 'lendio') {
        this.props.history.push('/business-application/12345678/lendio');
      } else {
        this.props.history.push('/business-application/12345678/success');
      }
    } else {
      this.props.businessAppStore.businessPreQualificationFormSumbit(this.props.isPublic)
        .then(() => {
          const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
          Helper.toast('Business pre-qualification request submitted!', 'success');
          this.props.history.push(`/app/business-application/${url}`);
        });
    }
  }
  prequalBasicSubmit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
  }
  render() {
    const {
      BUSINESS_APP_FRM, BUSINESS_APP_FRM_BASIC, BUSINESS_APP_REAL_ESTATE_FRM,
      businessAppEleChange, isPrequalQulify, currentApplicationType,
    } = this.props.businessAppStore;
    const { params } = this.props.match;
    if (params.applicationType !== 'business-real-estate' && currentApplicationType !== 'business-real-estate' && params.applicationType !== 'business' && currentApplicationType !== 'business') {
      return <NotFound />;
    }
    return (
      <Grid container>
        <Grid.Column>
          <Form onSubmit={this.prequalBasicSubmit} className="issuer-signup">
            <Icon className="ns-paper-plane" size="massive" color="green" />
            <FormElementWrap
              as="h1"
              header="Pre-Qualification Application Process"
              subHeader={
                <Aux>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.
                  <Link to={this.props.isPublic ? 'business-application/need-help' : 'need-help'} className="link">Need help or have questions?</Link>
                </Aux>
              }
            />
            {this.props.isPublic &&
            <FormElementWrap header="First, please tell us a little about yourself!">
              <div className="field-wrap">
                <Form.Group widths="equal">
                  {
                    ['firstName', 'lastName', 'email'].map(field => (
                      <FormInput
                        autoFocus={field === 'firstName'}
                        disabled={isPrequalQulify}
                        key={field}
                        type="text"
                        name={field}
                        fielddata={BUSINESS_APP_FRM_BASIC.fields[field]}
                        changed={(e, res) => businessAppEleChange(e, res, 'BUSINESS_APP_FRM_BASIC')}
                      />
                    ))
                  }
                </Form.Group>
              </div>
              {!isPrequalQulify &&
              <Button
                loading={this.props.uiStore.inProgress}
                disabled={!BUSINESS_APP_FRM_BASIC.meta.isValid}
                size="large"
                color="green"
                className="very relaxed"
              >
                Continue
              </Button>
              }
            </FormElementWrap>
            }
          </Form>
          {isPrequalQulify &&
          <Form onSubmit={this.submit} className="issuer-signup">
            {params.applicationType === 'business-real-estate' || currentApplicationType === 'business-real-estate' ?
              <PreQualRealEstate /> :
              <PreQualBusiness />
            }
            <Divider hidden />
            <Button
              loading={this.props.uiStore.inProgress}
              disabled={params.applicationType === 'business' || currentApplicationType === 'business' ? !BUSINESS_APP_FRM.meta.isValid : !BUSINESS_APP_REAL_ESTATE_FRM.meta.isValid}
              size="large"
              color="green"
              className="very relaxed"
            >
              Submit
            </Button>
          </Form>
          }
        </Grid.Column>
      </Grid>
    );
  }
}
