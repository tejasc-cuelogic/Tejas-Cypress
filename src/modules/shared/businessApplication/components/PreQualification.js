import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { Container, Icon, Form, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../helper/utility';
import { FormInput } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import PreQualBusiness from './prequlification/PreQualBusiness';
import PreQualRealEstate from './prequlification/PreQualRealEstate';
import NotFound from '../../../shared/NotFound';
import { DataFormatter } from '../../../../helper';

@inject('businessAppStore', 'uiStore')
@withRouter
@observer
export default class PreQualification extends Component {
  componentWillMount() {
    if (this.props.isPublic) {
      const { params } = this.props.match;
      const urlParameter = DataFormatter.QueryStringToJSON(this.props.location.search);
      this.props.businessAppStore.setFieldvalue('urlParameter', urlParameter);
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
      this.props.businessAppStore.businessPreQualificationBasicFormSumbit()
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
    if (this.props.isPublic) {
      this.props.businessAppStore.businessPreQualificationBasicFormSumbit()
        .then(() => {
          this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
        });
    }
  }
  render() {
    const {
      BUSINESS_APP_FRM, BUSINESS_APP_FRM_BASIC,
      businessAppEleChange, isPrequalQulify, currentApplicationType,
    } = this.props.businessAppStore;
    const { hideFields, match } = this.props;
    const { params } = match;
    if (params.applicationType !== 'commercial-real-estate' && currentApplicationType !== 'commercial-real-estate' && params.applicationType !== 'business' && currentApplicationType !== 'business') {
      return <NotFound />;
    }
    return (
      <Container className={hideFields ? 'inner-content-spacer' : ''}>
        <Form onSubmit={this.prequalBasicSubmit} className="issuer-signup">
          {!hideFields &&
          <Aux>
            <Icon className="ns-paper-plane" size="massive" color="green" />
            <FormElementWrap
              as="h1"
              header="Pre-Qualification Application Process"
              subHeader={
                <Aux>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.
                  <Link to={this.props.isPublic ? '/business-application/questions/need-help' : 'need-help'} className="link">Need help or have questions?</Link>
                </Aux>
              }
            />
          </Aux>
          }
          {this.props.isPublic &&
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
          {params.applicationType === 'commercial-real-estate' || currentApplicationType === 'commercial-real-estate' ?
            <PreQualRealEstate hideFields={hideFields} applicationType={params.applicationType} /> :
            <PreQualBusiness hideFields={hideFields} applicationType={params.applicationType} />
          }
          {!hideFields &&
          <Aux>
            <Divider hidden />
            <Button
              loading={this.props.uiStore.inProgress}
              disabled={!BUSINESS_APP_FRM.meta.isValid}
              size="large"
              color="green"
              className="very relaxed"
            >
              Submit
            </Button>
          </Aux>
          }
        </Form>
        }
      </Container>
    );
  }
}
