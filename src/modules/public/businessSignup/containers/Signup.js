import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Icon, Header, Divider, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup } from '../../../../theme/form/FormElements';

@inject('accountStore', 'entityAccountStore')
@observer
class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content issuer-signup">
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
              <Divider section />
              <Header as="h1">
                What is your Business Model?
                <Header.Subheader>
                  Only Business to Consumer models are accepted at this time
                </Header.Subheader>
              </Header>
              <FormRadioGroup
                fielddata={formEntityInfo.fields.isEntityTrust}
                name="isEntityTrust"
                changed={entityInfoChange}
                containerclassname="button-radio center-align"
              />
            </Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
