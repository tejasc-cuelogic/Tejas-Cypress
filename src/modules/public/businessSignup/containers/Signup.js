import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Icon, Header, Divider, Form, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup } from '../../../../theme/form/FormElements';

@inject('newBusinessStore')
@observer
class Signup extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange,
    } = this.props.newBusinessStore;
    return (
      <Segment vertical className="content">
        <Grid container>
          <Grid.Column>
            <Form className="issuer-signup">
              <Icon className="ns-paper-plane" size="huge" color="green" />
              <Header as="h1">
                Pre-Qualification Application Process
                <Header.Subheader>
                  Welcome to NextSeed! Run through this quick form to get pre-qualified.{' '}
                  <Link to="/" className="link">Need help or have questions?</Link>
                </Header.Subheader>
              </Header>
              <Divider section className="doubled" />
              <Header as="h2">
                What is your Business Model?
                <Header.Subheader>
                  Only Business to Consumer models are accepted at this time
                </Header.Subheader>
              </Header>
              <FormRadioGroup
                fielddata={BUSINESS_APP_FRM.fields.businessType}
                name="businessType"
                changed={businessAppEleChange}
                containerclassname="button-radio"
              />
              <Divider section className="doubled" />
              <Header as="h2">General Information</Header>
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <h2>test</h2>
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as="h5">Business Address</Header>
                  </div>
                </Grid.Column>
              </Grid>
              <Divider section className="doubled" />
              <Header as="h2">
                What industry are you in?
                <Header.Subheader>Please select all that apply.</Header.Subheader>
              </Header>
              <div className="iconic-checkbox">
                <Checkbox icon="ns-store" label="Fashion & Merchandising" />
                <Checkbox icon="ns-beauty-spa" label="Beauty & Spa" />
                <Checkbox icon="ns-food-light" label="Food & Beverage" />
                <Checkbox icon="ns-real-estate" label="Real Estate" />
                <Checkbox icon="ns-fitness" label="Fitness & Wellness" />
                <Checkbox icon="ns-first-aid" label="Hospitality" />
                <Checkbox icon="ns-technology" label="Technology" />
                <Checkbox label="Other Industry Type" />
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
